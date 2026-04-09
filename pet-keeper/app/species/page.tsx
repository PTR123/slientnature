'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Thermometer, Droplets, Search, Filter, Loader2 } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { cn } from '@/lib/utils';

const categories = [
  { id: 'insect', name: '昆虫', subcategories: ['甲虫', '螳螂', '蝴蝶/飞蛾', '蝗虫'] },
  { id: 'reptile', name: '爬宠', subcategories: ['守宫', '蜥蜴', '蛇', '龟'] },
  { id: 'aquatic', name: '水族', subcategories: ['观赏虾', '热带鱼', '原生鱼', '观赏螺'] },
  { id: 'bird', name: '鸟类', subcategories: ['鹦鹉', '雀类'] },
  { id: 'exotic', name: '异宠', subcategories: ['捕鸟蛛', '蜜袋鼯', '松鼠', '刺猬'] }
];

// 解析JSON数组的辅助函数
function parseJsonArray(data: any): any[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.error('Failed to parse array:', e);
      return [];
    }
  }
  return [];
}

export default function SpeciesPage() {
  const [species, setSpecies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadSpecies();
  }, []);

  const loadSpecies = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getSpecies();
      // 确保数组字段被正确解析
      const parsedData = data.map((s: any) => ({
        ...s,
        diet: parseJsonArray(s.diet),
        substrate: parseJsonArray(s.substrate),
        decor: parseJsonArray(s.decor),
        lifecycle: parseJsonArray(s.lifecycle),
        diseases: parseJsonArray(s.diseases)
      }));
      setSpecies(parsedData);
    } catch (error) {
      console.error('Failed to load species:', error);
      // 如果API失败，可以回退到静态数据
      // 但正常情况下应该显示错误信息
    } finally {
      setLoading(false);
    }
  };

  const filteredSpecies = species.filter((s) => {
    const matchesCategory = !selectedCategory || s.category === selectedCategory;
    const matchesSubcategory = !selectedSubcategory || s.subcategory === selectedSubcategory;
    const matchesSearch =
      !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSubcategory && matchesSearch;
  });

  const currentCategory = categories.find((c) => c.id === selectedCategory);

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return '新手友好';
      case 'intermediate':
        return '进阶玩家';
      case 'advanced':
        return '专业玩家';
      default:
        return difficulty;
    }
  };

  const getDifficultyVariant = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'default';
      case 'intermediate':
        return 'secondary';
      case 'advanced':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-forest-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 botanical-pattern">
      {/* Header */}
      <div className="bg-white border-b border-cream-200">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-bold text-forest-950 mb-2">物种图鉴</h1>
          <p className="text-forest-600">专业的异宠数据库，从入门到精通</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Search */}
              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-forest-400" />
                  <input
                    type="text"
                    placeholder="搜索物种..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-cream-300 bg-white focus:outline-none focus:ring-2 focus:ring-forest-500 text-sm"
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-display font-semibold text-forest-950 mb-3 flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  分类筛选
                </h3>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedSubcategory(null);
                    }}
                    className={cn(
                      'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      !selectedCategory
                        ? 'bg-forest-100 text-forest-900'
                        : 'text-forest-700 hover:bg-cream-100'
                    )}
                  >
                    全部物种
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setSelectedSubcategory(null);
                      }}
                      className={cn(
                        'w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        selectedCategory === category.id
                          ? 'bg-forest-100 text-forest-900'
                          : 'text-forest-700 hover:bg-cream-100'
                      )}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subcategories */}
              {currentCategory && (
                <div>
                  <h3 className="font-display font-semibold text-forest-950 mb-3">
                    {currentCategory.name}分类
                  </h3>
                  <div className="space-y-1">
                    {currentCategory.subcategories.map((sub) => (
                      <button
                        key={sub}
                        onClick={() => setSelectedSubcategory(sub)}
                        className={cn(
                          'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                          selectedSubcategory === sub
                            ? 'bg-amber-100 text-amber-900'
                            : 'text-forest-700 hover:bg-cream-100'
                        )}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Clear Filters */}
              {(selectedCategory || selectedSubcategory || searchQuery) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedSubcategory(null);
                    setSearchQuery('');
                  }}
                  className="w-full"
                >
                  清除筛选
                </Button>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filters */}
            <div className="lg:hidden mb-6 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-forest-400" />
                <input
                  type="text"
                  placeholder="搜索物种..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-cream-300 bg-white focus:outline-none focus:ring-2 focus:ring-forest-500 text-sm"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2">
                <Button
                  variant={!selectedCategory ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedSubcategory(null);
                  }}
                >
                  全部
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setSelectedSubcategory(null);
                    }}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-sm text-forest-600">
                找到 <span className="font-semibold text-forest-900">{filteredSpecies.length}</span> 个物种
              </p>
            </div>

            {/* Species Grid */}
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredSpecies.map((s) => (
                <Link key={s.id} href={`/species/${s.id}`}>
                  <Card className="overflow-hidden hover-lift h-full group">
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={s.image || '/images/default-species.png'}
                        alt={s.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          // 图片加载失败时使用占位符
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                        }}
                        unoptimized={s.image?.startsWith('http://localhost:3001')}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <Badge
                        variant={getDifficultyVariant(s.difficulty)}
                        className="absolute top-3 right-3"
                      >
                        {getDifficultyLabel(s.difficulty)}
                      </Badge>
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="font-display font-semibold text-xl mb-1">
                          {s.name}
                        </h3>
                        <p className="text-sm text-white/80 italic">
                          {s.scientificName}
                        </p>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-forest-600">{s.subcategory}</span>
                        <span className="text-sm text-forest-600">{s.lifespan}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-forest-700">
                        <div className="flex items-center">
                          <Thermometer className="h-4 w-4 mr-1 text-terracotta-600" />
                          {s.temperatureMin}-{s.temperatureMax}°C
                        </div>
                        <div className="flex items-center">
                          <Droplets className="h-4 w-4 mr-1 text-blue-600" />
                          {s.humidityMin}-{s.humidityMax}%
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {filteredSpecies.length === 0 && (
              <div className="text-center py-12">
                <p className="text-forest-600">没有找到符合条件的物种</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedSubcategory(null);
                    setSearchQuery('');
                  }}
                >
                  清除筛选
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}