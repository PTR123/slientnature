import { Pet, CommunityPost } from './types';
import { speciesData } from './data';

export const mockPets: Pet[] = [
  {
    id: 'pet-1',
    name: '小绿',
    speciesId: 'phelsuma-laticauda',
    species: speciesData.find(s => s.id === 'phelsuma-laticauda')!,
    image: 'https://images.unsplash.com/photo-1504450874802-0ba2bcd9b5ae?w=800',
    birthDate: '2024-01-15',
    acquisitionDate: '2024-03-01',
    records: [
      {
        id: 'rec-1',
        petId: 'pet-1',
        date: '2024-03-15',
        type: 'feeding',
        notes: '吃了一只大蟋蟀，食欲很好',
        image: 'https://images.unsplash.com/photo-1504450874802-0ba2bcd9b5ae?w=400'
      },
      {
        id: 'rec-2',
        petId: 'pet-1',
        date: '2024-03-10',
        type: 'molt',
        notes: '成功脱皮，颜色变得更鲜艳',
        image: 'https://images.unsplash.com/photo-1504450874802-0ba2bcd9b5ae?w=400'
      },
      {
        id: 'rec-3',
        petId: 'pet-1',
        date: '2024-03-05',
        type: 'weighing',
        notes: '体重: 8g，体长: 12cm',
        weight: 8,
        length: 12
      }
    ]
  },
  {
    id: 'pet-2',
    name: '大力',
    speciesId: 'dynastes-hercules',
    species: speciesData.find(s => s.id === 'dynastes-hercules')!,
    image: 'https://images.unsplash.com/photo-1559253664-ca249d4608c6?w=800',
    birthDate: '2023-12-01',
    acquisitionDate: '2024-02-20',
    records: [
      {
        id: 'rec-4',
        petId: 'pet-2',
        date: '2024-03-18',
        type: 'feeding',
        notes: '吃了甲虫果冻，很喜欢',
        image: 'https://images.unsplash.com/photo-1559253664-ca249d4608c6?w=400'
      },
      {
        id: 'rec-5',
        petId: 'pet-2',
        date: '2024-03-12',
        type: 'other',
        notes: '活动力强，经常爬行',
        image: 'https://images.unsplash.com/photo-1559253664-ca249d4608c6?w=400'
      }
    ]
  },
  {
    id: 'pet-3',
    name: '兰兰',
    speciesId: 'hymenopus-coronatus',
    species: speciesData.find(s => s.id === 'hymenopus-coronatus')!,
    image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800',
    birthDate: '2024-02-01',
    acquisitionDate: '2024-02-15',
    records: [
      {
        id: 'rec-6',
        petId: 'pet-3',
        date: '2024-03-19',
        type: 'molt',
        notes: 'L4脱皮成功，体型明显增大',
        image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400'
      },
      {
        id: 'rec-7',
        petId: 'pet-3',
        date: '2024-03-17',
        type: 'feeding',
        notes: '吃了2只果蝇'
      }
    ]
  },
  {
    id: 'pet-4',
    name: '小水晶',
    speciesId: 'caridina-cantonensis',
    species: speciesData.find(s => s.id === 'caridina-cantonensis')!,
    image: 'https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?w=800',
    birthDate: '2024-01-01',
    acquisitionDate: '2024-01-15',
    records: [
      {
        id: 'rec-8',
        petId: 'pet-4',
        date: '2024-03-20',
        type: 'water_change',
        notes: '换水30%，添加硝化细菌'
      },
      {
        id: 'rec-9',
        petId: 'pet-4',
        date: '2024-03-15',
        type: 'breeding',
        notes: '发现抱卵母虾3只',
        image: 'https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?w=400'
      }
    ]
  },
  {
    id: 'pet-5',
    name: '小角',
    speciesId: 'correlophus-ciliatus',
    species: speciesData.find(s => s.id === 'correlophus-ciliatus')!,
    image: 'https://images.unsplash.com/photo-1518709764753-9c4078dcfcc5?w=800',
    birthDate: '2023-06-01',
    acquisitionDate: '2023-09-01',
    records: [
      {
        id: 'rec-10',
        petId: 'pet-5',
        date: '2024-03-14',
        type: 'weighing',
        notes: '体重: 15g，体长: 18cm',
        weight: 15,
        length: 18
      },
      {
        id: 'rec-11',
        petId: 'pet-5',
        date: '2024-03-08',
        type: 'molt',
        notes: '脱皮顺利，颜色更加鲜艳',
        image: 'https://images.unsplash.com/photo-1518709764753-9c4078dcfcc5?w=400'
      }
    ]
  }
];

export const mockPosts: CommunityPost[] = [
  {
    id: 'post-1',
    author: '昆虫爱好者小王',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    title: '我的长戟大兜虫终于羽化成功了！',
    content: '经过7个月的等待，我的长戟大兜虫终于羽化了！分享一下我的饲养经验...',
    image: 'https://images.unsplash.com/photo-1559253664-ca249d4608c6?w=800',
    likes: 128,
    comments: 34,
    createdAt: '2024-03-19',
    tags: ['甲虫', '羽化', '长戟大兜虫']
  },
  {
    id: 'post-2',
    author: '守宫达人',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    title: '睫角守宫造景分享',
    content: '最近给睫角守宫重新布置了环境，添加了一些竹筒和藤蔓...',
    image: 'https://images.unsplash.com/photo-1518709764753-9c4078dcfcc5?w=800',
    likes: 89,
    comments: 21,
    createdAt: '2024-03-18',
    tags: ['守宫', '造景', '睫角']
  },
  {
    id: 'post-3',
    author: '水族新手',
    authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    title: '水晶虾养殖一个月记录',
    content: '开缸一个月了，虾的状态还不错，分享一下水质参数和日常管理...',
    image: 'https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?w=800',
    likes: 156,
    comments: 42,
    createdAt: '2024-03-17',
    tags: ['水晶虾', '开缸', '水质']
  },
  {
    id: 'post-4',
    author: '螳螂观察者',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    title: '兰花螳螂L5到L6的成长记录',
    content: '记录了兰花螳螂从L5到L6的脱皮过程，附上详细的温湿度数据...',
    image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800',
    likes: 234,
    comments: 56,
    createdAt: '2024-03-16',
    tags: ['螳螂', '脱皮', '兰花螳螂']
  },
  {
    id: 'post-5',
    author: '异宠玩家',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    title: '鬃狮蜥的日常饮食搭配',
    content: '分享一下我家鬃狮蜥的日常食谱，包括蔬菜、昆虫的比例和喂食频率...',
    image: 'https://images.unsplash.com/photo-1504222490335-21f637409e0a?w=800',
    likes: 178,
    comments: 38,
    createdAt: '2024-03-15',
    tags: ['鬃狮蜥', '饮食', '爬宠']
  },
  {
    id: 'post-6',
    author: '热带鱼爱好者',
    authorAvatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100',
    title: '神仙鱼繁殖成功经验分享',
    content: '经过多次尝试，终于成功繁殖出神仙鱼幼鱼，分享一下关键要点...',
    image: 'https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?w=800',
    likes: 312,
    comments: 67,
    createdAt: '2024-03-14',
    tags: ['神仙鱼', '繁殖', '热带鱼']
  },
  {
    id: 'post-7',
    author: '捕鸟蛛玩家',
    authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100',
    title: '巨人捕鸟蛛脱皮全过程',
    content: '记录了巨人捕鸟蛛完整的脱皮过程，从开始到结束大约用了3小时...',
    image: 'https://images.unsplash.com/photo-1559253664-ca249d4608c6?w=800',
    likes: 267,
    comments: 48,
    createdAt: '2024-03-13',
    tags: ['捕鸟蛛', '脱皮', '巨人捕鸟蛛']
  },
  {
    id: 'post-8',
    author: '鹦鹉饲养员',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    title: '绿颊锥尾鹦鹉玩具推荐',
    content: '整理了一些适合绿颊锥尾鹦鹉的玩具，包括啃咬玩具、觅食玩具...',
    image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800',
    likes: 145,
    comments: 29,
    createdAt: '2024-03-12',
    tags: ['鹦鹉', '玩具', '绿颊锥尾']
  }
];