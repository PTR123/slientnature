import { Router, Response } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// 获取所有帖子
router.get('/', async (req, res: Response) => {
  try {
    const { sort } = req.query;

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'trending') {
      orderBy = { likes: { _count: 'desc' } };
    }

    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      },
      orderBy
    });

    res.json(posts);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Failed to get posts' });
  }
});

// 获取单个帖子
router.get('/:id', async (req, res: Response) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        },
        likes: {
          select: {
            userId: true
          }
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            likes: true,
            comments: true
          }
        }
      }
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Failed to get post' });
  }
});

// 创建帖子
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, image, tags } = req.body;

    // 标题验证
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (title.length > 100) {
      return res.status(400).json({ error: 'Title must be less than 100 characters' });
    }

    // 内容验证
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Content is required' });
    }
    if (content.length > 10000) {
      return res.status(400).json({ error: 'Content must be less than 10000 characters' });
    }

    // 标签验证
    let parsedTags = [];
    if (tags) {
      if (!Array.isArray(tags)) {
        return res.status(400).json({ error: 'Tags must be an array' });
      }
      if (tags.length > 10) {
        return res.status(400).json({ error: 'Maximum 10 tags allowed' });
      }
      parsedTags = tags.filter(tag => typeof tag === 'string' && tag.length <= 20);
    }

    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        image,
        tags: JSON.stringify(parsedTags),
        authorId: req.userId!
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      }
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// 点赞帖子
router.post('/:id/like', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId: id,
          userId: req.userId!
        }
      }
    });

    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id }
      });
      return res.json({ liked: false });
    } else {
      await prisma.like.create({
        data: {
          postId: id,
          userId: req.userId!
        }
      });
      return res.json({ liked: true });
    }
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ error: 'Failed to like post' });
  }
});

// 添加评论
router.post('/:id/comments', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    // 内容验证
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Content is required' });
    }
    if (content.length > 500) {
      return res.status(400).json({ error: 'Comment must be less than 500 characters' });
    }

    // 检查帖子是否存在
    const post = await prisma.post.findUnique({
      where: { id }
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const comment = await prisma.comment.create({
      data: {
        postId: id,
        userId: req.userId!,
        content: content.trim()
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      }
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

// 删除帖子
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findFirst({
      where: { id, authorId: req.userId }
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found or unauthorized' });
    }

    await prisma.post.delete({
      where: { id }
    });

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

export default router;