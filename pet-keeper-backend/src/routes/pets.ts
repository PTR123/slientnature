import { Router, Response } from 'express';
import prisma from '../lib/prisma.js';
import { authenticate, AuthRequest } from '../middleware/auth.js';

const router = Router();

// 获取用户的所有宠物
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const pets = await prisma.pet.findMany({
      where: { userId: req.userId },
      include: {
        records: {
          orderBy: { date: 'desc' },
          take: 5
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(pets);
  } catch (error) {
    console.error('Get pets error:', error);
    res.status(500).json({ error: 'Failed to get pets' });
  }
});

// 获取单个宠物
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const pet = await prisma.pet.findFirst({
      where: {
        id,
        userId: req.userId
      },
      include: {
        records: {
          orderBy: { date: 'desc' }
        }
      }
    });

    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    res.json(pet);
  } catch (error) {
    console.error('Get pet error:', error);
    res.status(500).json({ error: 'Failed to get pet' });
  }
});

// 创建宠物
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { name, species, birthDate, acquisitionDate, image } = req.body;

    // 名字验证
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (name.length > 50) {
      return res.status(400).json({ error: 'Name must be less than 50 characters' });
    }

    // 物种验证
    if (!species || species.trim().length === 0) {
      return res.status(400).json({ error: 'Species is required' });
    }
    if (species.length > 100) {
      return res.status(400).json({ error: 'Species must be less than 100 characters' });
    }

    // 日期验证
    if (!birthDate || !acquisitionDate) {
      return res.status(400).json({ error: 'Birth date and acquisition date are required' });
    }

    const birthDateObj = new Date(birthDate);
    const acquisitionDateObj = new Date(acquisitionDate);
    const now = new Date();

    if (isNaN(birthDateObj.getTime())) {
      return res.status(400).json({ error: 'Invalid birth date' });
    }
    if (isNaN(acquisitionDateObj.getTime())) {
      return res.status(400).json({ error: 'Invalid acquisition date' });
    }
    if (birthDateObj > now) {
      return res.status(400).json({ error: 'Birth date cannot be in the future' });
    }
    if (acquisitionDateObj > now) {
      return res.status(400).json({ error: 'Acquisition date cannot be in the future' });
    }

    const pet = await prisma.pet.create({
      data: {
        name: name.trim(),
        species: species.trim(),
        birthDate: birthDateObj,
        acquisitionDate: acquisitionDateObj,
        image,
        userId: req.userId!
      }
    });

    res.status(201).json(pet);
  } catch (error) {
    console.error('Create pet error:', error);
    res.status(500).json({ error: 'Failed to create pet' });
  }
});

// 更新宠物
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, species, image, birthDate, acquisitionDate } = req.body;

    const pet = await prisma.pet.findFirst({
      where: { id, userId: req.userId }
    });

    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    const updatedPet = await prisma.pet.update({
      where: { id },
      data: {
        name,
        species,
        image,
        birthDate: birthDate ? new Date(birthDate) : undefined,
        acquisitionDate: acquisitionDate ? new Date(acquisitionDate) : undefined
      }
    });

    res.json(updatedPet);
  } catch (error) {
    console.error('Update pet error:', error);
    res.status(500).json({ error: 'Failed to update pet' });
  }
});

// 删除宠物
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const pet = await prisma.pet.findFirst({
      where: { id, userId: req.userId }
    });

    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    await prisma.pet.delete({
      where: { id }
    });

    res.json({ message: 'Pet deleted successfully' });
  } catch (error) {
    console.error('Delete pet error:', error);
    res.status(500).json({ error: 'Failed to delete pet' });
  }
});

// 添加记录
router.post('/:id/records', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { type, date, notes, image, weight, length } = req.body;

    // 类型验证
    const validTypes = ['molt', 'feeding', 'weighing', 'water_change', 'treatment', 'breeding', 'other'];
    if (!type || !validTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid record type' });
    }

    // 日期验证
    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }
    const recordDate = new Date(date);
    if (isNaN(recordDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date' });
    }
    if (recordDate > new Date()) {
      return res.status(400).json({ error: 'Date cannot be in the future' });
    }

    // 笔记验证
    if (notes && notes.length > 1000) {
      return res.status(400).json({ error: 'Notes must be less than 1000 characters' });
    }

    // 数值验证
    if (weight !== undefined && (typeof weight !== 'number' || weight < 0 || weight > 10000)) {
      return res.status(400).json({ error: 'Invalid weight value' });
    }
    if (length !== undefined && (typeof length !== 'number' || length < 0 || length > 1000)) {
      return res.status(400).json({ error: 'Invalid length value' });
    }

    const pet = await prisma.pet.findFirst({
      where: { id, userId: req.userId }
    });

    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    const record = await prisma.record.create({
      data: {
        petId: id,
        type,
        date: recordDate,
        notes: notes?.trim() || '',
        image,
        weight,
        length
      }
    });

    res.status(201).json(record);
  } catch (error) {
    console.error('Create record error:', error);
    res.status(500).json({ error: 'Failed to create record' });
  }
});

// 获取宠物所有记录
router.get('/:id/records', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const pet = await prisma.pet.findFirst({
      where: { id, userId: req.userId }
    });

    if (!pet) {
      return res.status(404).json({ error: 'Pet not found' });
    }

    const records = await prisma.record.findMany({
      where: { petId: id },
      orderBy: { date: 'desc' }
    });

    res.json(records);
  } catch (error) {
    console.error('Get records error:', error);
    res.status(500).json({ error: 'Failed to get records' });
  }
});

export default router;