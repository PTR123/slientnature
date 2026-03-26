'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Thermometer, Droplets, Search, Filter } from 'lucide-react';
import { speciesData, categories } from '@/lib/data';
import { cn } from '@/lib/utils';

export default function SpeciesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSpecies = speciesData.filter((species) => {
    const matchesCategory = !selectedCategory || species.category === selectedCategory;
    const matchesSubcategory =
      !selectedSubcategory || species.subcategory === selectedSubcategory;
    const matchesSearch =
      !searchQuery ||
      species.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      species.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSubcategory && matchesSearch;
  });

  const currentCategory = categories.find((c) => c.id === selectedCategory);

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
              {filteredSpecies.map((species) => (
                <Link key={species.id} href={`/species/${species.id}`}>
                  <Card className="overflow-hidden hover-lift h-full group">
                    <div className="relative h-56 overflow-hidden">
                      <Image
                        src={species.image}
                        alt={species.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <Badge
                        variant={species.difficulty}
                        className="absolute top-3 right-3"
                      >
                        {species.difficulty === 'beginner' && '新手友好'}
                        {species.difficulty === 'intermediate' && '进阶玩家'}
                        {species.difficulty === 'advanced' && '专业玩家'}
                      </Badge>
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="font-display font-semibold text-xl mb-1">
                          {species.name}
                        </h3>
                        <p className="text-sm text-white/80 italic">
                          {species.scientificName}
                        </p>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-forest-600">{species.subcategory}</span>
                        <span className="text-sm text-forest-600">{species.lifespan}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-forest-700">
                        <div className="flex items-center">
                          <Thermometer className="h-4 w-4 mr-1 text-terracotta-600" />
                          {species.temperature.min}-{species.temperature.max}°C
                        </div>
                        <div className="flex items-center">
                          <Droplets className="h-4 w-4 mr-1 text-blue-600" />
                          {species.humidity.min}-{species.humidity.max}%
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