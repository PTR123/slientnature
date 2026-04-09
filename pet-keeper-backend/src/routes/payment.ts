import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// 所有支付接口都需要登录
router.use(authenticate);

/**
 * 创建支付订单（模拟支付）
 * 这是一个简化的沙箱测试接口，无需真实的第三方支付平台
 */
router.post('/create', async (req: AuthRequest, res: Response) => {
  try {
    const { orderId, paymentMethod = 'mock' } = req.body;
    const userId = req.user!.id;

    // 查询订单
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId, status: 'pending' }
    });

    if (!order) {
      return res.status(404).json({ error: '订单不存在或已支付' });
    }

    // 检查订单是否超时（30分钟）
    const orderAge = Date.now() - new Date(order.createdAt).getTime();
    if (orderAge > 30 * 60 * 1000) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'cancelled',
          cancelledAt: new Date()
        }
      });
      return res.status(400).json({ error: '订单已超时，请重新下单' });
    }

    // 模拟支付：生成支付参数
    const paymentData = {
      orderId: order.id,
      orderNo: order.orderNo,
      amount: order.payAmount,
      paymentMethod,
      timestamp: Date.now(),
      // 模拟支付链接（前端可以使用这个跳转到模拟支付页面）
      payUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/mock?orderId=${order.id}&amount=${order.payAmount}`
    };

    res.json({
      success: true,
      data: paymentData,
      message: '支付订单创建成功'
    });
  } catch (error) {
    console.error('创建支付订单失败:', error);
    res.status(500).json({ error: '创建支付订单失败' });
  }
});

/**
 * 模拟支付成功
 * 用于沙箱测试：直接将订单标记为已支付
 */
router.post('/mock/pay', async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.body;
    const userId = req.user!.id;

    // 查询订单
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId, status: 'pending' }
    });

    if (!order) {
      return res.status(404).json({ error: '订单不存在或已支付' });
    }

    // 更新订单状态为已支付
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'paid',
        paymentMethod: 'mock',
        transactionId: `MOCK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        paidAt: new Date()
      }
    });

    res.json({
      success: true,
      order: updatedOrder,
      message: '支付成功'
    });
  } catch (error) {
    console.error('支付失败:', error);
    res.status(500).json({ error: '支付失败' });
  }
});

/**
 * 查询支付状态
 */
router.get('/status/:orderId', async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.params;
    const userId = req.user!.id;

    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      select: {
        id: true,
        orderNo: true,
        status: true,
        payAmount: true,
        paymentMethod: true,
        transactionId: true,
        paidAt: true,
        createdAt: true
      }
    });

    if (!order) {
      return res.status(404).json({ error: '订单不存在' });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('查询支付状态失败:', error);
    res.status(500).json({ error: '查询支付状态失败' });
  }
});

/**
 * 支付超时检查（定时任务可以调用）
 */
router.post('/check-timeout', async (req: Request, res: Response) => {
  try {
    // 查找30分钟未支付的订单
    const timeoutOrders = await prisma.order.findMany({
      where: {
        status: 'pending',
        createdAt: {
          lt: new Date(Date.now() - 30 * 60 * 1000)
        }
      }
    });

    // 取消超时订单
    for (const order of timeoutOrders) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: 'cancelled',
          cancelledAt: new Date()
        }
      });
    }

    res.json({
      success: true,
      cancelledCount: timeoutOrders.length,
      message: `已取消 ${timeoutOrders.length} 个超时订单`
    });
  } catch (error) {
    console.error('检查超时订单失败:', error);
    res.status(500).json({ error: '检查超时订单失败' });
  }
});

export default router;