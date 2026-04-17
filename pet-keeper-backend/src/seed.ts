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

  // Create product categories
  const categories = await Promise.all([
    prisma.productCategory.upsert({
      where: { id: 'cat-food' },
      update: {},
      create: {
        id: 'cat-food',
        name: '饲料食品',
        description: '各种宠物专用饲料和营养补充剂',
        image: 'https://images.unsplash.com/photo-1568640347083-2f5e5c1f8c1e?w=400',
        sortOrder: 1
      }
    }),
    prisma.productCategory.upsert({
      where: { id: 'cat-housing' },
      update: {},
      create: {
        id: 'cat-housing',
        name: '饲养箱具',
        description: '饲养箱、加热设备、照明设备等',
        image: 'https://images.unsplash.com/photo-1585155770913-4a6b2d3f7e2a?w=400',
        sortOrder: 2
      }
    }),
    prisma.productCategory.upsert({
      where: { id: 'cat-accessories' },
      update: {},
      create: {
        id: 'cat-accessories',
        name: '配件装饰',
        description: '躲避屋、造景材料、装饰配件等',
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
        sortOrder: 3
      }
    }),
    prisma.productCategory.upsert({
      where: { id: 'cat-health' },
      update: {},
      create: {
        id: 'cat-health',
        name: '健康护理',
        description: '医疗用品、保健品、清洁用品等',
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c1f9c0e6?w=400',
        sortOrder: 4
      }
    })
  ]);

  console.log(`✅ Created ${categories.length} categories`);

  // Create sample products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { id: 'prod-jelly' },
      update: {},
      create: {
        id: 'prod-jelly',
        name: '甲虫专用果冻（高蛋白）',
        description: '富含蛋白质和维生素，适合甲虫成虫食用',
        content: '优质甲虫果冻，采用天然原料制作，富含蛋白质、维生素和矿物质，促进甲虫健康成长。',
        categoryId: 'cat-food',
        images: JSON.stringify(['https://images.unsplash.com/photo-1568640347083-2f5e5c1f8c1e?w=800']),
        price: 15.00,
        originalPrice: 20.00,
        stock: 100,
        sales: 50,
        unit: '个',
        isHot: true,
        isNew: false,
        isRecommend: true,
        sortOrder: 1
      }
    }),
    prisma.product.upsert({
      where: { id: 'prod-cricket' },
      update: {},
      create: {
        id: 'prod-cricket',
        name: '活体蟋蟀（小型）',
        description: '营养丰富，适合守宫、螳螂等小型爬宠',
        content: '活体蟋蟀，高蛋白低脂肪，是守宫、螳螂等爬宠的理想食物来源。',
        categoryId: 'cat-food',
        images: JSON.stringify(['https://images.unsplash.com/photo-1596178060671-77c2b5c4f7e4?w=800']),
        price: 30.00,
        stock: 200,
        sales: 80,
        unit: '盒（50只）',
        isHot: true,
        isNew: false,
        sortOrder: 2
      }
    }),
    prisma.product.upsert({
      where: { id: 'prod-tank' },
      update: {},
      create: {
        id: 'prod-tank',
        name: '亚克力饲养箱（中型）',
        description: '30x20x20cm，适合甲虫饲养',
        content: '透明亚克力材质，便于观察，透气性好，带有防逃逸设计。',
        categoryId: 'cat-housing',
        images: JSON.stringify(['https://images.unsplash.com/photo-1585155770913-4a6b2d3f7e2a?w=800']),
        price: 89.00,
        originalPrice: 120.00,
        stock: 50,
        sales: 30,
        unit: '个',
        isHot: false,
        isNew: true,
        isRecommend: true,
        sortOrder: 1
      }
    }),
    prisma.product.upsert({
      where: { id: 'prod-heater' },
      update: {},
      create: {
        id: 'prod-heater',
        name: '爬宠加热垫（小型）',
        description: '恒温加热，安全可靠',
        content: '智能恒温控制，安全加热，适合爬宠饲养箱使用。',
        categoryId: 'cat-housing',
        images: JSON.stringify(['https://images.unsplash.com/photo-1584308666744-24d5c1f9c0e6?w=800']),
        price: 65.00,
        stock: 80,
        sales: 45,
        unit: '个',
        isHot: true,
        sortOrder: 2
      }
    }),
    prisma.product.upsert({
      where: { id: 'prod-hide' },
      update: {},
      create: {
        id: 'prod-hide',
        name: '树洞躲避屋',
        description: '天然材质，适合守宫、螳螂躲避',
        content: '采用天然树干制作，提供安全的躲避空间，满足宠物天性需求。',
        categoryId: 'cat-accessories',
        images: JSON.stringify(['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800']),
        price: 45.00,
        stock: 60,
        sales: 25,
        unit: '个',
        isNew: true,
        sortOrder: 1
      }
    }),
    prisma.product.upsert({
      where: { id: 'prod-mite' },
      update: {},
      create: {
        id: 'prod-mite',
        name: '甲虫除螨喷雾',
        description: '有效去除螨虫，安全无害',
        content: '专为甲虫研发的除螨喷雾，安全有效，不伤害甲虫。',
        categoryId: 'cat-health',
        images: JSON.stringify(['https://images.unsplash.com/photo-1584308666744-24d5c1f9c0e6?w=800']),
        price: 35.00,
        stock: 40,
        sales: 20,
        unit: '瓶',
        isRecommend: true,
        sortOrder: 1
      }
    })
  ]);

  console.log(`✅ Created ${products.length} products`);

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