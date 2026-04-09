import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, AuthRequest, requireAdmin } from '../middleware/auth.js';

const router = Router();

// ==================== 公开接口 ====================

// 获取分类列表（公开）
router.get('/', async (req: Request, res: Response) => {
  try {
    const categories = await prisma.productCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    res.json(categories.map(cat => ({
      ...cat,
      productCount: cat._count.products
    })));
  } catch (error) {
    console.error('获取分类列表失败:', error);
    res.status(500).json({ error: '获取分类列表失败' });
  }
});

// 获取分类详情（公开）
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await prisma.productCategory.findUnique({
      where: { id },
      include: {
        products: {
          where: { isActive: true },
          take: 10,
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: { products: true }
        }
      }
    });

    if (!category) {
      return res.status(404).json({ error: '分类不存在' });
    }

    if (!category.isActive) {
      return res.status(404).json({ error: '分类已禁用' });
    }

    res.json({
      ...category,
      productCount: category._count.products
    });
  } catch (error) {
    console.error('获取分类详情失败:', error);
    res.status(500).json({ error: '获取分类详情失败' });
  }
});

// ==================== 管理员接口 ====================

// 创建分类（管理员）
router.post('/admin', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, image, sortOrder } = req.body;

    if (!name) {
      return res.status(400).json({ error: '分类名称必填' });
    }

    // 检查是否已存在同名分类
    const existing = await prisma.productCategory.findFirst({
      where: { name }
    });

    if (existing) {
      return res.status(400).json({ error: '分类名称已存在' });
    }

    const category = await prisma.productCategory.create({
      data: {
        name,
        description: description || '',
        image,
        sortOrder: sortOrder ? Number(sortOrder) : 0,
        isActive: true
      }
    });

    res.json(category);
  } catch (error) {
    console.error('创建分类失败:', error);
    res.status(500).json({ error: '创建分类失败' });
  }
});

// 更新分类（管理员）
router.put('/admin/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, image, sortOrder, isActive } = req.body;

    // 检查分类是否存在
    const existing = await prisma.productCategory.findUnique({
      where: { id }
    });

    if (!existing) {
      return res.status(404).json({ error: '分类不存在' });
    }

    // 如果修改名称，检查是否重复
    if (name && name !== existing.name) {
      const duplicate = await prisma.productCategory.findFirst({
        where: { name }
      });
      if (duplicate) {
        return res.status(400).json({ error: '分类名称已存在' });
      }
    }

    const category = await prisma.productCategory.update({
      where: { id },
      data: {
        name,
        description,
        image,
        sortOrder: sortOrder ? Number(sortOrder) : undefined,
        isActive
      }
    });

    res.json(category);
  } catch (error) {
    console.error('更新分类失败:', error);
    res.status(500).json({ error: '更新分类失败' });
  }
});

// 删除分类（管理员）
router.delete('/admin/:id', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // 检查分类是否存在
    const category = await prisma.productCategory.findUnique({
      where: { id }
    });

    if (!category) {
      return res.status(404).json({ error: '分类不存在' });
    }

    // 检查是否有商品使用该分类
    const productsCount = await prisma.product.count({
      where: { categoryId: id }
    });

    if (productsCount > 0) {
      return res.status(400).json({
        error: '该分类下还有商品，无法删除',
        productsCount
      });
    }

    await prisma.productCategory.delete({ where: { id } });
    res.json({ message: '分类已删除' });
  } catch (error) {
    console.error('删除分类失败:', error);
    res.status(500).json({ error: '删除分类失败' });
  }
});

export default router;