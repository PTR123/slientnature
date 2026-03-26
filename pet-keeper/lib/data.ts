import { Species } from './types';

export const speciesData: Species[] = [
  {
    id: 'dynastes-hercules',
    name: '长戟大兜虫',
    scientificName: 'Dynastes hercules',
    category: 'insect',
    subcategory: '甲虫',
    image: 'https://images.unsplash.com/photo-1559253664-ca249d4608c6?w=800',
    difficulty: 'intermediate',
    temperature: { min: 22, max: 28 },
    humidity: { min: 60, max: 80 },
    lifespan: '12-18个月',
    origin: '中南美洲热带雨林',
    diet: ['甲虫果冻', '香蕉', '芒果', '专用饲料'],
    feedingFrequency: '每2-3天喂食一次',
    enclosure: {
      substrate: ['发酵木屑', '腐殖土'],
      decor: ['树皮', '枯枝', '躲避屋'],
      size: '至少30x20x20cm'
    },
    lifecycle: ['卵(30-45天)', 'L1幼虫(1个月)', 'L2幼虫(1.5个月)', 'L3幼虫(6-8个月)', '蛹(1个月)', '成虫(3-5个月)'],
    diseases: [
      {
        name: '螨虫感染',
        symptoms: ['体表出现白色小点', '活动力下降', '食欲减退'],
        treatment: '隔离饲养，使用甲虫专用除螨剂',
        vetRequired: false
      },
      {
        name: '脱水',
        symptoms: ['身体皱缩', '反应迟钝'],
        treatment: '提高湿度，增加水分补充',
        vetRequired: false
      }
    ]
  },
  {
    id: 'phelsuma-laticauda',
    name: '宽尾守宫',
    scientificName: 'Phelsuma laticauda',
    category: 'reptile',
    subcategory: '守宫',
    image: 'https://images.unsplash.com/photo-1504450874802-0ba2bcd9b5ae?w=800',
    difficulty: 'beginner',
    temperature: { min: 25, max: 30 },
    humidity: { min: 50, max: 70 },
    lifespan: '5-8年',
    origin: '马达加斯加北部',
    diet: ['果泥', '蟋蟀', '果蝇', '花蜜'],
    feedingFrequency: '每天喂食一次',
    enclosure: {
      substrate: ['椰土', '树皮'],
      decor: ['竹筒', '仿真植物', '藤蔓', '躲避屋'],
      size: '至少30x30x45cm'
    },
    lifecycle: ['幼体(0-3个月)', '亚成体(3-8个月)', '成体(8个月以上)'],
    diseases: [
      {
        name: '代谢性骨病',
        symptoms: ['四肢颤抖', '行动困难', '骨骼变形'],
        treatment: '补充钙粉和维生素D3，UVB灯照射',
        vetRequired: true
      },
      {
        name: '脱皮困难',
        symptoms: ['旧皮残留', '眼部积皮'],
        treatment: '提高湿度，提供粗糙表面协助脱皮',
        vetRequired: false
      }
    ]
  },
  {
    id: 'hymenopus-coronatus',
    name: '兰花螳螂',
    scientificName: 'Hymenopus coronatus',
    category: 'insect',
    subcategory: '螳螂',
    image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800',
    difficulty: 'intermediate',
    temperature: { min: 24, max: 30 },
    humidity: { min: 70, max: 85 },
    lifespan: '6-12个月',
    origin: '东南亚热带雨林',
    diet: ['果蝇', '家蝇', '小蟋蟀', '蛾类'],
    feedingFrequency: '每天或隔天喂食',
    enclosure: {
      substrate: ['椰土', '水苔'],
      decor: ['仿真兰花', '树枝', '叶片'],
      size: '至少20x20x30cm'
    },
    lifecycle: ['卵鞘(3-6周)', 'L1若虫', 'L2-L6若虫(各2-3周)', '成虫(2-3个月)'],
    diseases: [
      {
        name: '真菌感染',
        symptoms: ['体表出现白色绒毛状物', '行动迟缓'],
        treatment: '立即隔离，降低湿度，使用抗真菌剂',
        vetRequired: false
      },
      {
        name: '脱水',
        symptoms: ['眼睛凹陷', '身体皱缩'],
        treatment: '提高湿度，喷水补充水分',
        vetRequired: false
      }
    ]
  },
  {
    id: 'caridina-cantonensis',
    name: '水晶虾',
    scientificName: 'Caridina cantonensis',
    category: 'aquatic',
    subcategory: '观赏虾',
    image: 'https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?w=800',
    difficulty: 'advanced',
    temperature: { min: 22, max: 26 },
    humidity: { min: 0, max: 0 },
    lifespan: '1-2年',
    origin: '中国南方',
    diet: ['藻类', '虾粮', '蔬菜', '微生物'],
    feedingFrequency: '每天少量喂食',
    enclosure: {
      substrate: ['ADA泥', '尼特利泥'],
      decor: ['莫斯', '沉木', '石头', '水草'],
      size: '至少30x30x30cm'
    },
    lifecycle: ['卵(25-30天)', '幼虾(1-2个月)', '成虾(可繁殖)'],
    diseases: [
      {
        name: '白点病',
        symptoms: ['体表白点', '摩擦身体', '食欲不振'],
        treatment: '提高温度至28°C，使用专用药物治疗',
        vetRequired: true
      },
      {
        name: '脱壳困难',
        symptoms: ['旧壳残留', '行动困难'],
        treatment: '调整GH至4-6度，补充矿物质',
        vetRequired: false
      }
    ]
  },
  {
    id: 'correlophus-ciliatus',
    name: '睫角守宫',
    scientificName: 'Correlophus ciliatus',
    category: 'reptile',
    subcategory: '守宫',
    image: 'https://images.unsplash.com/photo-1518709764753-9c4078dcfcc5?w=800',
    difficulty: 'beginner',
    temperature: { min: 22, max: 26 },
    humidity: { min: 60, max: 80 },
    lifespan: '15-20年',
    origin: '新喀里多尼亚',
    diet: ['果泥', '蟋蟀', '果蝇', '花蜜'],
    feedingFrequency: '每天喂食一次',
    enclosure: {
      substrate: ['椰土', '树皮', '水苔'],
      decor: ['竹筒', '藤蔓', '宽叶植物', '躲避屋'],
      size: '至少20x20x30cm'
    },
    lifecycle: ['幼体(0-6个月)', '亚成体(6-12个月)', '成体(12个月以上)'],
    diseases: [
      {
        name: '尾部滞留',
        symptoms: ['脱皮时尾部皮肤无法完全脱落'],
        treatment: '提高湿度，人工协助脱皮',
        vetRequired: false
      },
      {
        name: '呼吸道感染',
        symptoms: ['张口呼吸', '鼻腔分泌物', '食欲不振'],
        treatment: '提高温度，降低湿度，及时就医',
        vetRequired: true
      }
    ]
  },
  {
    id: 'pogona-vitticeps',
    name: '鬃狮蜥',
    scientificName: 'Pogona vitticeps',
    category: 'reptile',
    subcategory: '蜥蜴',
    image: 'https://images.unsplash.com/photo-1504222490335-21f637409e0a?w=800',
    difficulty: 'beginner',
    temperature: { min: 26, max: 38 },
    humidity: { min: 30, max: 50 },
    lifespan: '8-12年',
    origin: '澳大利亚中部',
    diet: ['蟋蟀', '杜比亚', '蔬菜', '水果', '钙粉'],
    feedingFrequency: '幼体每天，成体隔天',
    enclosure: {
      substrate: ['瓷砖', '报纸', '爬虫沙'],
      decor: ['晒台', '躲避屋', '攀爬枝'],
      size: '至少120x60x60cm'
    },
    lifecycle: ['幼体(0-4个月)', '亚成体(4-12个月)', '成体(12个月以上)'],
    diseases: [
      {
        name: '代谢性骨病',
        symptoms: ['四肢颤抖', '骨骼变形', '行动困难'],
        treatment: '补充钙粉和维生素D3，使用UVB灯',
        vetRequired: true
      },
      {
        name: '肠胃炎',
        symptoms: ['腹泻', '食欲不振', '消瘦'],
        treatment: '调整饮食，补充益生菌',
        vetRequired: true
      }
    ]
  },
  {
    id: 'pteroptyx-camelus',
    name: '长颈鹿锯锹',
    scientificName: 'Prosopocoilus giraffa',
    category: 'insect',
    subcategory: '甲虫',
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8b58?w=800',
    difficulty: 'intermediate',
    temperature: { min: 22, max: 28 },
    humidity: { min: 65, max: 80 },
    lifespan: '10-14个月',
    origin: '东南亚',
    diet: ['甲虫果冻', '香蕉', '芒果'],
    feedingFrequency: '每2-3天喂食一次',
    enclosure: {
      substrate: ['发酵木屑', '产卵木'],
      decor: ['树皮', '枯枝', '躲避屋'],
      size: '至少25x15x15cm'
    },
    lifecycle: ['卵(20-30天)', 'L1幼虫', 'L2幼虫', 'L3幼虫(5-7个月)', '蛹(30-45天)', '成虫(2-4个月)'],
    diseases: [
      {
        name: '真菌感染',
        symptoms: ['体表白斑', '活动力下降'],
        treatment: '隔离，改善通风，使用抗真菌剂',
        vetRequired: false
      }
    ]
  },
  {
    id: 'melanoides-tuberculata',
    name: '马来螺',
    scientificName: 'Melanoides tuberculata',
    category: 'aquatic',
    subcategory: '观赏螺',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
    difficulty: 'beginner',
    temperature: { min: 20, max: 28 },
    humidity: { min: 0, max: 0 },
    lifespan: '2-5年',
    origin: '东南亚',
    diet: ['藻类', '残饵', '蔬菜'],
    feedingFrequency: '无需专门喂食',
    enclosure: {
      substrate: ['细沙', '泥'],
      decor: ['石头', '沉木'],
      size: '至少20L水体'
    },
    lifecycle: ['胎生繁殖', '幼螺(2-3个月成熟)'],
    diseases: [
      {
        name: '壳腐蚀',
        symptoms: ['壳表面粗糙', '壳变薄'],
        treatment: '调整水质pH至中性，补充钙质',
        vetRequired: false
      }
    ]
  },
  {
    id: 'orthodera-novaezealandiae',
    name: '新西兰螳螂',
    scientificName: 'Orthodera novaezealandiae',
    category: 'insect',
    subcategory: '螳螂',
    image: 'https://images.unsplash.com/photo-1597127015309-f248eb3e7b84?w=800',
    difficulty: 'beginner',
    temperature: { min: 20, max: 28 },
    humidity: { min: 50, max: 70 },
    lifespan: '6-10个月',
    origin: '新西兰',
    diet: ['果蝇', '家蝇', '小蟋蟀'],
    feedingFrequency: '每天或隔天喂食',
    enclosure: {
      substrate: ['椰土', '纸巾'],
      decor: ['树枝', '植物'],
      size: '至少15x15x20cm'
    },
    lifecycle: ['卵鞘(3-8周)', 'L1-L6若虫(各2-3周)', '成虫(2-3个月)'],
    diseases: [
      {
        name: '拒食',
        symptoms: ['长期不进食', '消瘦'],
        treatment: '更换食物种类，检查环境参数',
        vetRequired: false
      }
    ]
  },
  {
    id: 'betta-splendens',
    name: '泰国斗鱼',
    scientificName: 'Betta splendens',
    category: 'aquatic',
    subcategory: '热带鱼',
    image: 'https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?w=800',
    difficulty: 'beginner',
    temperature: { min: 24, max: 30 },
    humidity: { min: 0, max: 0 },
    lifespan: '2-3年',
    origin: '泰国',
    diet: ['鱼粮', '血虫', '水蚤'],
    feedingFrequency: '每天1-2次',
    enclosure: {
      substrate: ['细沙', '泥'],
      decor: ['水草', '躲避屋', '沉木'],
      size: '至少5L水体'
    },
    lifecycle: ['卵(24-48小时)', '幼鱼(2-3个月)', '成鱼'],
    diseases: [
      {
        name: '白点病',
        symptoms: ['体表白点', '摩擦身体'],
        treatment: '提高温度至28°C，使用白点净',
        vetRequired: false
      },
      {
        name: '烂鳍病',
        symptoms: ['鳍边缘发白', '鳍破损'],
        treatment: '改善水质，使用抗生素',
        vetRequired: true
      }
    ]
  },
  {
    id: 'trachyrhachys-coronata',
    name: '皇冠鬃狮',
    scientificName: 'Trachyrhachys coronata',
    category: 'insect',
    subcategory: '蝗虫',
    image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800',
    difficulty: 'beginner',
    temperature: { min: 25, max: 35 },
    humidity: { min: 30, max: 50 },
    lifespan: '4-6个月',
    origin: '北美洲',
    diet: ['草料', '蔬菜', '麦麸'],
    feedingFrequency: '每天喂食',
    enclosure: {
      substrate: ['细沙', '椰土'],
      decor: ['躲避屋', '树枝'],
      size: '至少30x20x20cm'
    },
    lifecycle: ['卵(10-14天)', '若虫(5-6个龄期)', '成虫(2-3个月)'],
    diseases: [
      {
        name: '真菌感染',
        symptoms: ['体表黑色斑点', '行动迟缓'],
        treatment: '降低湿度，改善通风',
        vetRequired: false
      }
    ]
  },
  {
    id: 'acanthoscurria-geniculata',
    name: '巨人捕鸟蛛',
    scientificName: 'Acanthoscurria geniculata',
    category: 'exotic',
    subcategory: '捕鸟蛛',
    image: 'https://images.unsplash.com/photo-1559253664-ca249d4608c6?w=800',
    difficulty: 'intermediate',
    temperature: { min: 25, max: 30 },
    humidity: { min: 70, max: 85 },
    lifespan: '雌性15-25年，雄性3-5年',
    origin: '巴西',
    diet: ['蟋蟀', '杜比亚', '乳鼠'],
    feedingFrequency: '每周1-2次',
    enclosure: {
      substrate: ['椰土', '泥炭土'],
      decor: ['躲避屋', '水盆', '树皮'],
      size: '至少30x30x20cm'
    },
    lifecycle: ['幼体(1-3年)', '亚成体(3-5年)', '成体'],
    diseases: [
      {
        name: '脱水',
        symptoms: ['腹部皱缩', '活动力下降'],
        treatment: '提高湿度，提供充足水源',
        vetRequired: false
      },
      {
        name: '脱皮困难',
        symptoms: ['旧皮残留', '行动困难'],
        treatment: '提高湿度，人工协助脱皮',
        vetRequired: false
      }
    ]
  },
  {
    id: 'ramphastos-toco',
    name: '托哥巨嘴鸟',
    scientificName: 'Ramphastos toco',
    category: 'bird',
    subcategory: '鹦鹉',
    image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800',
    difficulty: 'advanced',
    temperature: { min: 20, max: 28 },
    humidity: { min: 50, max: 70 },
    lifespan: '15-20年',
    origin: '南美洲',
    diet: ['水果', '蔬菜', '昆虫', '专用饲料'],
    feedingFrequency: '每天2-3次',
    enclosure: {
      substrate: ['报纸', '木屑'],
      decor: ['栖木', '玩具', '躲避屋'],
      size: '至少2x2x2m'
    },
    lifecycle: ['幼鸟(0-6个月)', '亚成体(6-12个月)', '成体'],
    diseases: [
      {
        name: '铁贮积病',
        symptoms: ['食欲不振', '羽毛暗淡', '呼吸困难'],
        treatment: '调整饮食，减少高铁食物',
        vetRequired: true
      },
      {
        name: '喙部过度生长',
        symptoms: ['喙部过长', '影响进食'],
        treatment: '专业修剪喙部',
        vetRequired: true
      }
    ]
  },
  {
    id: 'pyrrhura-molinae',
    name: '绿颊锥尾鹦鹉',
    scientificName: 'Pyrrhura molinae',
    category: 'bird',
    subcategory: '鹦鹉',
    image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800',
    difficulty: 'intermediate',
    temperature: { min: 20, max: 28 },
    humidity: { min: 40, max: 60 },
    lifespan: '20-30年',
    origin: '南美洲',
    diet: ['种子', '水果', '蔬菜', '颗粒饲料'],
    feedingFrequency: '每天2次',
    enclosure: {
      substrate: ['报纸', '玉米芯'],
      decor: ['栖木', '玩具', '躲避屋'],
      size: '至少60x60x60cm'
    },
    lifecycle: ['幼鸟(0-6个月)', '亚成体(6-18个月)', '成体'],
    diseases: [
      {
        name: '羽毛拔除症',
        symptoms: ['过度梳理羽毛', '羽毛缺失'],
        treatment: '改善环境，增加玩具，减少压力',
        vetRequired: true
      },
      {
        name: '呼吸道感染',
        symptoms: ['打喷嚏', '鼻分泌物', '呼吸困难'],
        treatment: '保持温度稳定，及时就医',
        vetRequired: true
      }
    ]
  },
  {
    id: 'pterophyllum-scalare',
    name: '神仙鱼',
    scientificName: 'Pterophyllum scalare',
    category: 'aquatic',
    subcategory: '热带鱼',
    image: 'https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?w=800',
    difficulty: 'intermediate',
    temperature: { min: 24, max: 30 },
    humidity: { min: 0, max: 0 },
    lifespan: '10-15年',
    origin: '亚马逊河流域',
    diet: ['鱼粮', '血虫', '丰年虾'],
    feedingFrequency: '每天1-2次',
    enclosure: {
      substrate: ['细沙', '泥'],
      decor: ['水草', '沉木', '石头'],
      size: '至少100L水体'
    },
    lifecycle: ['卵(48-72小时)', '幼鱼(1-2个月)', '成鱼'],
    diseases: [
      {
        name: '头洞病',
        symptoms: ['头部出现孔洞', '食欲不振'],
        treatment: '改善水质，补充维生素，药物治疗',
        vetRequired: true
      },
      {
        name: '腹水病',
        symptoms: ['腹部肿大', '鳞片竖起'],
        treatment: '隔离治疗，使用抗生素',
        vetRequired: true
      }
    ]
  }
];

export const categories = [
  { id: 'insect', name: '昆虫', subcategories: ['甲虫', '螳螂', '蝴蝶/飞蛾', '蝗虫'] },
  { id: 'reptile', name: '爬宠', subcategories: ['守宫', '蜥蜴', '蛇', '龟'] },
  { id: 'aquatic', name: '水族', subcategories: ['观赏虾', '热带鱼', '原生鱼', '观赏螺'] },
  { id: 'bird', name: '鸟类', subcategories: ['鹦鹉', '雀类'] },
  { id: 'exotic', name: '异宠', subcategories: ['捕鸟蛛', '蜜袋鼯', '松鼠', '刺猬'] }
];