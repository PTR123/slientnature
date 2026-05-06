import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, AuthRequest, requireAdmin } from '../middleware/auth.js';

const router = Router();

// ==================== 用户接口 ====================

// 创建订单
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const {
      cartItemIds,
      receiverName,
      receiverPhone,
      receiverAddress,
      remark
    } = req.body;

    if (!cartItemIds || cartItemIds.length === 0) {
      return res.status(400).json({ error: '请选择要购买的商品' });
    }

    if (!receiverName || !receiverPhone || !receiverAddress) {
      return res.status(400).json({ error: '请填写收货信息' });
    }

    // 获取购物车项
    const cartItems = await prisma.cartItem.findMany({
      where: {
        id: { in: cartItemIds },
        userId,
        selected: true
      },
      include: { product: true }
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: '没有选中的商品' });
    }

    // 检查库存
    for (const item of cartItems) {
      if (!item.product.isActive) {
        return res.status(400).json({ error: `商品 ${item.product.name} 已下架` });
      }
      if (item.product.stock < item.quantity) {
        return res.status(400).json({ error: `商品 ${item.product.name} 库存不足` });
      }
    }

    // 生成订单号
    const orderNo = `PK${Date.now()}${Math.random().toString(36).substr(2, 9)}`;

    // 计算总价
    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    // 创建订单
    const order = await prisma.order.create({
      data: {
        orderNo,
        userId,
        totalAmount,
        payAmount: totalAmount,
        status: 'pending',
        receiverName,
        receiverPhone,
        receiverAddress,
        remark,
        items: {
          create: cartItems.map(item => ({
            productId: item.productId,
            productName: item.product.name,
            productImage: JSON.parse(item.product.images)[0] || '',
            price: item.product.price,
            quantity: item.quantity
          }))
        }
      },
      include: {
        items: true
      }
    });

    // 删除购物车项
    await prisma.cartItem.deleteMany({
      where: { id: { in: cartItemIds } }
    });

    res.json(order);
  } catch (error) {
    console.error('创建订单失败:', error);
    res.status(500).json({ error: '创建订单失败' });
  }
});

// 获取订单列表
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { status, page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: any = { userId };

    if (status) {
      where.status = String(status);
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            select: {
              id: true,
              productName: true,
              productImage: true,
              price: true,
              quantity: true
            }
          }
        }
      }),
      prisma.order.count({ where })
    ]);

    res.json({
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('获取订单列表失败:', error);
    res.status(500).json({ error: '获取订单列表失败' });
  }
});

// 获取订单详情
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const order = await prisma.order.findFirst({
      where: { id, userId },
      include: {
        items: true
      }
    });

    if (!order) {
      return res.status(404).json({ error: '订单不存在' });
    }

    res.json(order);
  } catch (error) {
    console.error('获取订单详情失败:', error);
    res.status(500).json({ error: '获取订单详情失败' });
  }
});

// 取消订单
router.post('/:id/cancel', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const order = await prisma.order.findFirst({
      where: { id, userId }
    });

    if (!order) {
      return res.status(404).json({ error: '订单不存在' });
    }

    if (order.status !== 'pending') {
      return res.status(400).json({ error: '只能取消待支付订单' });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: 'cancelled',
        cancelledAt: new Date()
      }
    });

    res.json(updated);
  } catch (error) {
    console.error('取消订单失败:', error);
    res.status(500).json({ error: '取消订单失败' });
  }
});

// 确认收货
router.post('/:id/complete', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const order = await prisma.order.findFirst({
      where: { id, userId }
    });

    if (!order) {
      return res.status(404).json({ error: '订单不存在' });
    }

    if (order.status !== 'shipped') {
      return res.status(400).json({ error: '只能确认已发货订单' });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: 'completed',
        completedAt: new Date()
      }
    });

    res.json(updated);
  } catch (error) {
    console.error('确认收货失败:', error);
    res.status(500).json({ error: '确认收货失败' });
  }
});

// ==================== 管理员接口 ====================

// 获取所有订单（管理员）
router.get('/admin/all', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const take = Number(limit);

    const where: any = {};

    if (status) {
      where.status = String(status);
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatar: true
            }
          },
          items: true
        }
      }),
      prisma.order.count({ where })
    ]);

    res.json({
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('获取所有订单失败:', error);
    res.status(500).json({ error: '获取所有订单失败' });
  }
});

// 发货（管理员）
router.post('/admin/:id/ship', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id }
    });

    if (!order) {
      return res.status(404).json({ error: '订单不存在' });
    }

    if (order.status !== 'paid') {
      return res.status(400).json({ error: '只能发货已支付订单' });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: 'shipped',
        shippedAt: new Date()
      }
    });

    res.json(updated);
  } catch (error) {
    console.error('发货失败:', error);
    res.status(500).json({ error: '发货失败' });
  }
});

// 订单统计（管理员）
router.get('/admin/stats', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const stats = await prisma.order.groupBy({
      by: ['status'],
      _count: true,
      _sum: {
        totalAmount: true
      }
    });

    const result = {
      pending: { count: 0, amount: 0 },
      paid: { count: 0, amount: 0 },
      shipped: { count: 0, amount: 0 },
      completed: { count: 0, amount: 0 },
      cancelled: { count: 0, amount: 0 }
    };

    stats.forEach(stat => {
      const status = stat.status as keyof typeof result;
      result[status] = {
        count: stat._count,
        amount: stat._sum.totalAmount || 0
      };
    });

    res.json(result);
  } catch (error) {
    console.error('获取订单统计失败:', error);
    res.status(500).json({ error: '获取订单统计失败' });
  }
});

export default router;