import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create sample species
  const species = await Promise.all([
    prisma.species.upsert({
      where: { id: 'dynastes-hercules' },
      update: {},
      create: {
        id: 'dynastes-hercules',
        name: '长戟大兜虫',
        scientificName: 'Dynastes hercules',
        category: 'insect',
        subcategory: '甲虫',
        image: 'https://images.unsplash.com/photo-1559253664-ca249d4608c6?w=800',
        difficulty: 'intermediate',
        temperatureMin: 22,
        temperatureMax: 28,
        humidityMin: 60,
        humidityMax: 80,
        lifespan: '12-18个月',
        origin: '中南美洲热带雨林',
        diet: JSON.stringify(['甲虫果冻', '香蕉', '芒果', '专用饲料']),
        feedingFrequency: '每2-3天喂食一次',
        enclosureSize: '至少30x20x20cm',
        substrate: JSON.stringify(['发酵木屑', '腐殖土']),
        decor: JSON.stringify(['树皮', '枯枝', '躲避屋']),
        lifecycle: JSON.stringify(['卵(30-45天)', 'L1幼虫(1个月)', 'L2幼虫(1.5个月)', 'L3幼虫(6-8个月)', '蛹(1个月)', '成虫(3-5个月)']),
        diseases: JSON.stringify([
          {
            name: '螨虫感染',
            symptoms: ['体表出现白色小点', '活动力下降', '食欲减退'],
            treatment: '隔离饲养，使用甲虫专用除螨剂',
            vetRequired: false
          }
        ])
      }
    }),
    prisma.species.upsert({
      where: { id: 'phelsuma-laticauda' },
      update: {},
      create: {
        id: 'phelsuma-laticauda',
        name: '宽尾守宫',
        scientificName: 'Phelsuma laticauda',
        category: 'reptile',
        subcategory: '守宫',
        image: 'https://images.unsplash.com/photo-1504450874802-0ba2bcd9b5ae?w=800',
        difficulty: 'beginner',
        temperatureMin: 25,
        temperatureMax: 30,
        humidityMin: 50,
        humidityMax: 70,
        lifespan: '5-8年',
        origin: '马达加斯加北部',
        diet: JSON.stringify(['果泥', '蟋蟀', '果蝇', '花蜜']),
        feedingFrequency: '每天喂食一次',
        enclosureSize: '至少30x30x45cm',
        substrate: JSON.stringify(['椰土', '树皮']),
        decor: JSON.stringify(['竹筒', '仿真植物', '藤蔓', '躲避屋']),
        lifecycle: JSON.stringify(['幼体(0-3个月)', '亚成体(3-8个月)', '成体(8个月以上)']),
        diseases: JSON.stringify([])
      }
    }),
    prisma.species.upsert({
      where: { id: 'hymenopus-coronatus' },
      update: {},
      create: {
        id: 'hymenopus-coronatus',
        name: '兰花螳螂',
        scientificName: 'Hymenopus coronatus',
        category: 'insect',
        subcategory: '螳螂',
        image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800',
        difficulty: 'intermediate',
        temperatureMin: 24,
        temperatureMax: 30,
        humidityMin: 70,
        humidityMax: 85,
        lifespan: '6-12个月',
        origin: '东南亚热带雨林',
        diet: JSON.stringify(['果蝇', '家蝇', '小蟋蟀', '蛾类']),
        feedingFrequency: '每天或隔天喂食',
        enclosureSize: '至少20x20x30cm',
        substrate: JSON.stringify(['椰土', '水苔']),
        decor: JSON.stringify(['仿真兰花', '树枝', '叶片']),
        lifecycle: JSON.stringify(['卵鞘(3-6周)', 'L1若虫', 'L2-L6若虫(各2-3周)', '成虫(2-3个月)']),
        diseases: JSON.stringify([])
      }
    })
  ]);

  console.log(`✅ Created ${species.length} species`);

  // Create test user
  const hashedPassword = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      username: 'testuser',
      password: hashedPassword,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
    }
  });

  console.log(`✅ Created user: ${user.username}`);

  console.log('🎉 Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });