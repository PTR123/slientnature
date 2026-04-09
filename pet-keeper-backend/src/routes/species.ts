import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = Router();

// 解析JSON数组的辅助函数
function parseJsonArray(jsonStr: string | null): any[] {
  if (!jsonStr) return [];
  try {
    const parsed = JSON.parse(jsonStr);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to parse JSON array:', e);
    return [];
  }
}

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

    // 解析JSON字符串字段
    const parsedSpecies = species.map(item => ({
      ...item,
      diet: parseJsonArray(item.diet),
      substrate: parseJsonArray(item.substrate),
      decor: parseJsonArray(item.decor),
      lifecycle: parseJsonArray(item.lifecycle),
      diseases: parseJsonArray(item.diseases)
    }));

    res.json(parsedSpecies);
  } catch (error) {
    console.error('Get species error:', error);
    res.status(500).json({ error: 'Failed to get species' });
  }
});

// 获取分类列表 - 必须放在 /:id 之前
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

    // 解析JSON字符串字段
    const parsedSpecies = {
      ...species,
      diet: parseJsonArray(species.diet),
      substrate: parseJsonArray(species.substrate),
      decor: parseJsonArray(species.decor),
      lifecycle: parseJsonArray(species.lifecycle),
      diseases: parseJsonArray(species.diseases)
    };

    res.json(parsedSpecies);
  } catch (error) {
    console.error('Get species error:', error);
    res.status(500).json({ error: 'Failed to get species' });
  }
});

// 创建物种（管理员功能）
router.post('/', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const species = await prisma.species.create({
      data: {
        name: req.body.name,
        scientificName: req.body.scientificName,
        category: req.body.category,
        subcategory: req.body.subcategory,
        image: req.body.image,
        difficulty: req.body.difficulty,
        temperatureMin: req.body.temperatureMin,
        temperatureMax: req.body.temperatureMax,
        humidityMin: req.body.humidityMin,
        humidityMax: req.body.humidityMax,
        lifespan: req.body.lifespan,
        origin: req.body.origin,
        feedingFrequency: req.body.feedingFrequency,
        enclosureSize: req.body.enclosureSize,
        diet: JSON.stringify(req.body.diet || []),
        substrate: JSON.stringify(req.body.substrate || []),
        decor: JSON.stringify(req.body.decor || []),
        lifecycle: JSON.stringify(req.body.lifecycle || []),
        diseases: JSON.stringify(req.body.diseases || [])
      }
    });

    // 返回解析后的数据
    const parsedSpecies = {
      ...species,
      diet: parseJsonArray(species.diet),
      substrate: parseJsonArray(species.substrate),
      decor: parseJsonArray(species.decor),
      lifecycle: parseJsonArray(species.lifecycle),
      diseases: parseJsonArray(species.diseases)
    };

    res.status(201).json(parsedSpecies);
  } catch (error) {
    console.error('Create species error:', error);
    res.status(500).json({ error: 'Failed to create species' });
  }
});

export default router;