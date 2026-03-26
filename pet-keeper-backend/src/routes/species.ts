import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

// 获取所有物种
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, subcategory, search } = req.query;

    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (subcategory) {
      where.subcategory = subcategory;
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string } },
        { scientificName: { contains: search as string } }
      ];
    }

    const species = await prisma.species.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json(species);
  } catch (error) {
    console.error('Get species error:', error);
    res.status(500).json({ error: 'Failed to get species' });
  }
});

// 获取单个物种
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const species = await prisma.species.findUnique({
      where: { id }
    });

    if (!species) {
      return res.status(404).json({ error: 'Species not found' });
    }

    res.json(species);
  } catch (error) {
    console.error('Get species error:', error);
    res.status(500).json({ error: 'Failed to get species' });
  }
});

// 创建物种（管理员功能）
router.post('/', async (req: Request, res: Response) => {
  try {
    const species = await prisma.species.create({
      data: {
        ...req.body,
        diet: JSON.stringify(req.body.diet),
        substrate: JSON.stringify(req.body.substrate),
        decor: JSON.stringify(req.body.decor),
        lifecycle: JSON.stringify(req.body.lifecycle),
        diseases: JSON.stringify(req.body.diseases || [])
      }
    });

    res.status(201).json(species);
  } catch (error) {
    console.error('Create species error:', error);
    res.status(500).json({ error: 'Failed to create species' });
  }
});

// 获取分类列表
router.get('/meta/categories', async (req: Request, res: Response) => {
  try {
    const categories = await prisma.species.groupBy({
      by: ['category', 'subcategory'],
      _count: true
    });

    const result: any = {};
    categories.forEach(item => {
      if (!result[item.category]) {
        result[item.category] = [];
      }
      if (!result[item.category].includes(item.subcategory)) {
        result[item.category].push(item.subcategory);
      }
    });

    res.json(result);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to get categories' });
  }
});

export default router;