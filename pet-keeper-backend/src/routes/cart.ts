import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// 所有购物车接口都需要登录
router.use(authenticate);

// 获取购物车
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            images: true,
            price: true,
            originalPrice: true,
            stock: true,
            unit: true,
            isActive: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // 计算总价
    let totalAmount = 0;
    let selectedAmount = 0;

    const items = cartItems.map(item => {
      const itemTotal = item.product.price * item.quantity;
      totalAmount += itemTotal;
      if (item.selected) {
        selectedAmount += itemTotal;
      }

      return {
        ...item,
        itemTotal,
        product: {
          ...item.product,
          images: JSON.parse(item.product.images)
        }
      };
    });

    res.json({
      items,
      totalAmount,
      selectedAmount,
      itemCount: cartItems.length,
      selectedCount: cartItems.filter(i => i.selected).length
    });
  } catch (error) {
    console.error('获取购物车失败:', error);
    res.status(500).json({ error: '获取购物车失败' });
  }
});

// 添加到购物车
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ error: '缺少商品ID' });
    }

    // 检查商品是否存在
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({ error: '商品不存在' });
    }

    if (!product.isActive) {
      return res.status(400).json({ error: '商品已下架' });
    }

    // 检查库存
    if (product.stock < quantity) {
      return res.status(400).json({ error: '库存不足' });
    }

    // 检查是否已在购物车中
    const existing = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId
        }
      }
    });

    if (existing) {
      // 更新数量
      const newQuantity = existing.quantity + quantity;

      if (product.stock < newQuantity) {
        return res.status(400).json({ error: '库存不足' });
      }

      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: newQuantity },
        include: { product: true }
      });

      return res.json(updated);
    }

    // 创建新的购物车项
    const cartItem = await prisma.cartItem.create({
      data: {
        userId,
        productId,
        quantity
      },
      include: { product: true }
    });

    res.json(cartItem);
  } catch (error) {
    console.error('添加购物车失败:', error);
    res.status(500).json({ error: '添加购物车失败' });
  }
});

// 更新购物车项
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const { quantity, selected } = req.body;

    // 检查购物车项是否存在且属于当前用户
    const cartItem = await prisma.cartItem.findFirst({
      where: { id, userId },
      include: { product: true }
    });

    if (!cartItem) {
      return res.status(404).json({ error: '购物车项不存在' });
    }

    // 如果更新数量，检查库存
    if (quantity !== undefined) {
      if (cartItem.product.stock < quantity) {
        return res.status(400).json({ error: '库存不足' });
      }
    }

    const updated = await prisma.cartItem.update({
      where: { id },
      data: {
        quantity: quantity !== undefined ? Number(quantity) : undefined,
        selected: selected !== undefined ? Boolean(selected) : undefined
      },
      include: { product: true }
    });

    res.json(updated);
  } catch (error) {
    console.error('更新购物车失败:', error);
    res.status(500).json({ error: '更新购物车失败' });
  }
});

// 删除购物车项
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    // 检查购物车项是否存在且属于当前用户
    const cartItem = await prisma.cartItem.findFirst({
      where: { id, userId }
    });

    if (!cartItem) {
      return res.status(404).json({ error: '购物车项不存在' });
    }

    await prisma.cartItem.delete({ where: { id } });
    res.json({ message: '已删除' });
  } catch (error) {
    console.error('删除购物车项失败:', error);
    res.status(500).json({ error: '删除购物车项失败' });
  }
});

// 全选/取消全选
router.post('/select-all', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { selected } = req.body;

    await prisma.cartItem.updateMany({
      where: { userId },
      data: { selected: Boolean(selected) }
    });

    res.json({ message: '已更新' });
  } catch (error) {
    console.error('全选操作失败:', error);
    res.status(500).json({ error: '全选操作失败' });
  }
});

// 清空购物车
router.delete('/clear', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    await prisma.cartItem.deleteMany({
      where: { userId }
    });

    res.json({ message: '购物车已清空' });
  } catch (error) {
    console.error('清空购物车失败:', error);
    res.status(500).json({ error: '清空购物车失败' });
  }
});

export default router;