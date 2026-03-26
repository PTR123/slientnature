import { Router, Response } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = Router();

// 所有管理路由都需要管理员权限
router.use(authenticate);
router.use(requireAdmin);

// ============== 物种管理 ==============

// 更新物种
router.put('/species/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const species = await prisma.species.update({
      where: { id },
      data: {
        ...req.body,
        diet: req.body.diet ? JSON.stringify(req.body.diet) : undefined,
        substrate: req.body.substrate ? JSON.stringify(req.body.substrate) : undefined,
        decor: req.body.decor ? JSON.stringify(req.body.decor) : undefined,
        lifecycle: req.body.lifecycle ? JSON.stringify(req.body.lifecycle) : undefined,
        diseases: req.body.diseases ? JSON.stringify(req.body.diseases) : undefined,
      }
    });

    res.json(species);
  } catch (error) {
    console.error('Update species error:', error);
    res.status(500).json({ error: 'Failed to update species' });
  }
});

// 删除物种
router.delete('/species/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.species.delete({
      where: { id }
    });

    res.json({ message: 'Species deleted successfully' });
  } catch (error) {
    console.error('Delete species error:', error);
    res.status(500).json({ error: 'Failed to delete species' });
  }
});

// ============== 帖子管理 ==============

// 删除任意帖子
router.delete('/posts/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.post.delete({
      where: { id }
    });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// ============== 评论管理 ==============

// 删除任意评论
router.delete('/comments/:id', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.comment.delete({
      where: { id }
    });

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

// ============== 用户管理 ==============

// 获取所有用户
router.get('/users', async (req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        role: true,
        isBanned: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            comments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// 切换用户禁言状态
router.patch('/users/:id/ban', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { isBanned } = req.body;

    // 防止管理员禁言自己
    if (id === req.userId) {
      return res.status(400).json({ error: 'Cannot ban yourself' });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { isBanned },
      select: {
        id: true,
        username: true,
        isBanned: true
      }
    });

    res.json(user);
  } catch (error) {
    console.error('Ban user error:', error);
    res.status(500).json({ error: 'Failed to ban user' });
  }
});

// 设置用户角色
router.patch('/users/:id/role', async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // 防止管理员修改自己的角色
    if (id === req.userId) {
      return res.status(400).json({ error: 'Cannot change your own role' });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        username: true,
        role: true
      }
    });

    res.json(user);
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// ============== 统计数据 ==============

router.get('/stats', async (req: AuthRequest, res: Response) => {
  try {
    const [
      totalUsers,
      totalPosts,
      totalComments,
      totalSpecies
    ] = await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.comment.count(),
      prisma.species.count()
    ]);

    res.json({
      totalUsers,
      totalPosts,
      totalComments,
      totalSpecies
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

export default router;