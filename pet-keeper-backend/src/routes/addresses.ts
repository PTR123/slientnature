import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// 所有地址接口都需要登录
router.use(authenticate);

// 获取地址列表
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    res.json(addresses);
  } catch (error) {
    console.error('获取地址列表失败:', error);
    res.status(500).json({ error: '获取地址列表失败' });
  }
});

// 获取单个地址
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const address = await prisma.address.findFirst({
      where: { id, userId }
    });

    if (!address) {
      return res.status(404).json({ error: '地址不存在' });
    }

    res.json(address);
  } catch (error) {
    console.error('获取地址详情失败:', error);
    res.status(500).json({ error: '获取地址详情失败' });
  }
});

// 创建地址
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const {
      receiverName,
      receiverPhone,
      province,
      city,
      district,
      detail,
      isDefault
    } = req.body;

    // 验证必填字段
    if (!receiverName || !receiverPhone || !province || !city || !district || !detail) {
      return res.status(400).json({ error: '请填写完整的地址信息' });
    }

    // 如果设置为默认地址，先取消其他默认地址
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false }
      });
    }

    const address = await prisma.address.create({
      data: {
        userId,
        receiverName,
        receiverPhone,
        province,
        city,
        district,
        detail,
        isDefault: isDefault || false
      }
    });

    res.json(address);
  } catch (error) {
    console.error('创建地址失败:', error);
    res.status(500).json({ error: '创建地址失败' });
  }
});

// 更新地址
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;
    const {
      receiverName,
      receiverPhone,
      province,
      city,
      district,
      detail,
      isDefault
    } = req.body;

    // 检查地址是否存在
    const existingAddress = await prisma.address.findFirst({
      where: { id, userId }
    });

    if (!existingAddress) {
      return res.status(404).json({ error: '地址不存在' });
    }

    // 如果设置为默认地址，先取消其他默认地址
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false }
      });
    }

    const address = await prisma.address.update({
      where: { id },
      data: {
        receiverName,
        receiverPhone,
        province,
        city,
        district,
        detail,
        isDefault
      }
    });

    res.json(address);
  } catch (error) {
    console.error('更新地址失败:', error);
    res.status(500).json({ error: '更新地址失败' });
  }
});

// 设置默认地址
router.patch('/:id/default', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    // 检查地址是否存在
    const address = await prisma.address.findFirst({
      where: { id, userId }
    });

    if (!address) {
      return res.status(404).json({ error: '地址不存在' });
    }

    // 取消其他默认地址
    await prisma.address.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false }
    });

    // 设置当前地址为默认
    const updated = await prisma.address.update({
      where: { id },
      data: { isDefault: true }
    });

    res.json(updated);
  } catch (error) {
    console.error('设置默认地址失败:', error);
    res.status(500).json({ error: '设置默认地址失败' });
  }
});

// 删除地址
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    // 检查地址是否存在
    const address = await prisma.address.findFirst({
      where: { id, userId }
    });

    if (!address) {
      return res.status(404).json({ error: '地址不存在' });
    }

    await prisma.address.delete({
      where: { id }
    });

    res.json({ success: true, message: '删除成功' });
  } catch (error) {
    console.error('删除地址失败:', error);
    res.status(500).json({ error: '删除地址失败' });
  }
});

export default router;