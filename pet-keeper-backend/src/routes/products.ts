import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, AuthRequest, requireAdmin } from '../middleware/auth.js';

const router = Router();

// ==================== 公开接口 ====================

// 获取商品列表（公开）
router.get('/', async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      categoryId,
      keyword,
      sort = 'createdAt_desc'
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    // 构建查询条件
    const where: any = { isActive: true };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (keyword) {
      where.OR = [
        { name: { contains: String(keyword) } },
        { description: { contains: String(keyword) } }
      ];
    }

    // 排序
    let orderBy: any = {};
    const [field, direction] = String(sort).split('_');
    orderBy[field] = direction === 'asc' ? 'asc' : 'desc';

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          category: {
            select: { id: true, name: true }
          }
        }
      }),
      prisma.product.count({ where })
    ]);

    res.json({
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('获取商品列表失败:', error);
    res.status(500).json({ error: '获取商品列表失败' });
  }
});

// 获取商品详情（公开）
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: { id: true, name: true, description: true }
        }
      }
    });

    if (!product) {
      return res.status(404).json({ error: '商品不存在' });
    }

    if (!product.isActive) {
      return res.status(404).json({ error: '商品已下架' });
    }

    res.json(product);
  } catch (error) {
    console.error('获取商品详情失败:', error);
    res.status(500).json({ error: '获取商品详情失败' });
  }
});

// ==================== 管理员接口 ====================

// 创建商品（管理员）
router.post('/admin', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      description,
      content,
      categoryId,
      images,
      price,
      originalPrice,
      stock,
      unit,
      isHot,
      isNew,
      isRecommend
    } = req.body;

    // 验证必填字段
    if (!name || !description || !categoryId || !price) {
      return res.status(400).json({ error: '缺少必填字段' });
    }

    // 验证分类是否存在
    const category = await prisma.productCategory.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return res.status(400).json({ error: '分类不存在' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        content: content || '',
        categoryId,
        images: images || '[]',
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        stock: stock ? Number(stock) : 0,
        unit: unit || '件',
        isHot: isHot || false,
        isNew: isNew || false,
        isRecommend: isRecommend || false,
        isActive: true
      },
      include: {
        category: true
      }
    });

    res.json(product);
  } catch (error) {
    console.error('创建商品失败:', error);
    res.status(500).json({ error: '创建商品失败' });
  }
});

// 更新商品（管理员）
router.put('/admin/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      content,
      categoryId,
      images,
      price,
      originalPrice,
      stock,
      unit,
      isHot,
      isNew,
      isRecommend,
      isActive
    } = req.body;

    // 检查商品是否存在
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: '商品不存在' });
    }

    // 如果更换分类，验证分类是否存在
    if (categoryId) {
      const category = await prisma.productCategory.findUnique({
        where: { id: categoryId }
      });
      if (!category) {
        return res.status(400).json({ error: '分类不存在' });
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        content,
        categoryId,
        images,
        price: price ? Number(price) : undefined,
        originalPrice: originalPrice ? Number(originalPrice) : null,
        stock: stock ? Number(stock) : undefined,
        unit,
        isHot,
        isNew,
        isRecommend,
        isActive
      },
      include: {
        category: true
      }
    });

    res.json(product);
  } catch (error) {
    console.error('更新商品失败:', error);
    res.status(500).json({ error: '更新商品失败' });
  }
});

// 删除商品（管理员）
router.delete('/admin/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // 检查商品是否存在
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return res.status(404).json({ error: '商品不存在' });
    }

    // 检查是否有关联的订单项
    const orderItems = await prisma.orderItem.count({
      where: { productId: id }
    });

    if (orderItems > 0) {
      // 有订单关联，只能下架不能删除
      await prisma.product.update({
        where: { id },
        data: { isActive: false }
      });
      return res.json({ message: '商品已下架（存在关联订单）' });
    }

    // 检查是否在购物车中
    const cartItems = await prisma.cartItem.count({
      where: { productId: id }
    });

    if (cartItems > 0) {
      // 有购物车关联，先删除购物车项再删除商品
      await prisma.cartItem.deleteMany({
        where: { productId: id }
      });
    }

    await prisma.product.delete({ where: { id } });
    res.json({ message: '商品已删除' });
  } catch (error) {
    console.error('删除商品失败:', error);
    res.status(500).json({ error: '删除商品失败' });
  }
});

export default router;