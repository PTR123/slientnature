'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Thermometer,
  Droplets,
  MapPin,
  Clock,
  Leaf,
  Home,
  AlertCircle,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/components/auth-provider';
import { apiClient } from '@/lib/api';

interface SpeciesDetailClientProps {
  species: {
    id: string;
    name: string;
    scientificName: string;
    image: string;
    category: string;
    subcategory: string;
    difficulty: string;
    temperature: { min: number; max: number };
    humidity: { min: number; max: number };
    lifespan: string;
    origin: string;
    diet: string[];
    feedingFrequency: string;
    enclosure: {
      size: string;
      substrate: string[];
      decor: string[];
    };
    lifecycle: string[];
    diseases: {
      name: string;
      symptoms: string[];
      treatment: string;
      vetRequired: boolean;
    }[];
  };
}

export default function SpeciesDetailClient({ species }: SpeciesDetailClientProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleAddToMyPets = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setLoading(true);

    // 跳转到创建宠物页面，带上物种信息
    const params = new URLSearchParams({
      species: species.name,
      speciesImage: species.image
    });

    router.push(`/my-pets/create?${params.toString()}`);
  };

  const handleShare = async () => {
    const shareData = {
      title: `${species.name} - ${species.scientificName}`,
      text: `来看看这个有趣的物种：${species.name}（${species.scientificName}）`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        // 使用原生分享 API（移动端）
        await navigator.share(shareData);
      } else {
        // 桌面端：复制链接到剪贴板
        await navigator.clipboard.writeText(window.location.href);
        alert('链接已复制到剪贴板！');
      }
    } catch (error: any) {
      // 用户取消分享不需要提示
      if (error.name !== 'AbortError') {
        console.error('分享失败:', error);
        alert('分享失败，请重试');
      }
    }
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-br from-forest-900 to-forest-700">
        <Image
          src={species.image || 'https://via.placeholder.com/800x600?text=No+Image'}
          alt={species.name}
          fill
          className="object-cover opacity-40"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/800x600?text=No+Image';
          }}
          unoptimized={species.image?.startsWith('http://localhost:3001')}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <Link
              href="/species"
              className="inline-flex items-center text-sm text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ArrowRight className="h-4 w-4 mr-1 rotate-180" />
              返回物种图鉴
            </Link>
            <div className="flex items-start justify-between">
              <div>
                <Badge
                  variant={species.difficulty === 'beginner' ? 'default' : species.difficulty === 'intermediate' ? 'secondary' : 'destructive'}
                  className="mb-3"
                >
                  {species.difficulty === 'beginner' && '新手友好'}
                  {species.difficulty === 'intermediate' && '进阶玩家'}
                  {species.difficulty === 'advanced' && '专业玩家'}
                </Badge>
                <h1 className="font-display text-5xl font-bold text-white mb-2">
                  {species.name}
                </h1>
                <p className="text-xl text-white/80 italic">{species.scientificName}</p>
              </div>
              <Button
                size="lg"
                onClick={handleAddToMyPets}
                disabled={loading}
                className="hidden md:flex bg-white text-forest-700 hover:bg-cream-100"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Leaf className="mr-2 h-4 w-4" />
                )}
                添加到我的饲养
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>基础信息</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-forest-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-forest-600">分布地</p>
                      <p className="font-medium text-forest-950">{species.origin}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-forest-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-forest-600">寿命</p>
                      <p className="font-medium text-forest-950">{species.lifespan}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Thermometer className="h-5 w-5 text-terracotta-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-forest-600">适宜温度</p>
                      <p className="font-medium text-forest-950">
                        {species.temperature.min}-{species.temperature.max}°C
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Droplets className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm text-forest-600">适宜湿度</p>
                      <p className="font-medium text-forest-950">
                        {species.humidity.min}-{species.humidity.max}%
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lifecycle */}
            <Card>
              <CardHeader>
                <CardTitle>生命周期</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {species.lifecycle.map((stage, index) => (
                    <div key={index} className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-forest-100 flex items-center justify-center mr-3">
                        <span className="text-sm font-semibold text-forest-700">{index + 1}</span>
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-forest-950">{stage}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Diet */}
            <Card>
              <CardHeader>
                <CardTitle>食性指南</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-forest-600 mb-2">喂食频率</p>
                    <p className="font-medium text-forest-950">{species.feedingFrequency}</p>
                  </div>
                  <div>
                    <p className="text-sm text-forest-600 mb-2">推荐饲料</p>
                    <div className="flex flex-wrap gap-2">
                      {species.diet.map((food, index) => (
                        <Badge key={index} variant="outline">
                          {food}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enclosure */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Home className="h-5 w-5 mr-2" />
                  饲养环境建议
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-forest-600 mb-2">容器大小</p>
                    <p className="font-medium text-forest-950">{species.enclosure.size}</p>
                  </div>
                  <div>
                    <p className="text-sm text-forest-600 mb-2">垫材</p>
                    <div className="flex flex-wrap gap-2">
                      {species.enclosure.substrate.map((item, index) => (
                        <Badge key={index} variant="secondary">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-forest-600 mb-2">造景建议</p>
                    <div className="flex flex-wrap gap-2">
                      {species.enclosure.decor.map((item, index) => (
                        <Badge key={index} variant="secondary">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Diseases */}
            <Card className="border-terracotta-200">
              <CardHeader>
                <CardTitle className="flex items-center text-terracotta-700">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  常见疾病
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {species.diseases.map((disease, index) => {
                    // 支持字符串和对象两种格式
                    if (typeof disease === 'string') {
                      return (
                        <div
                          key={index}
                          className="border border-cream-200 rounded-lg p-4 bg-cream-50"
                        >
                          <h4 className="font-semibold text-forest-950">{disease}</h4>
                        </div>
                      );
                    }

                    // 对象格式：包含详细信息
                    return (
                      <div
                        key={index}
                        className="border border-cream-200 rounded-lg p-4 bg-cream-50"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-forest-950">{disease.name}</h4>
                          {disease.vetRequired && (
                            <Badge variant="destructive" className="ml-2">
                              需就医
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-2 text-sm">
                          <div>
                            <p className="text-forest-600 mb-1">症状:</p>
                            <ul className="list-disc list-inside text-forest-700">
                              {disease.symptoms.map((symptom, i) => (
                                <li key={i}>{symptom}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-forest-600 mb-1">处理建议:</p>
                            <p className="text-forest-700">{disease.treatment}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats Card */}
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-forest-50">
                    <div className="flex items-center">
                      <Thermometer className="h-5 w-5 text-terracotta-600 mr-2" />
                      <span className="text-sm font-medium">温度</span>
                    </div>
                    <span className="font-semibold text-forest-950">
                      {species.temperature.min}-{species.temperature.max}°C
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
                    <div className="flex items-center">
                      <Droplets className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="text-sm font-medium">湿度</span>
                    </div>
                    <span className="font-semibold text-forest-950">
                      {species.humidity.min}-{species.humidity.max}%
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Button
                    onClick={handleAddToMyPets}
                    disabled={loading}
                    className="w-full"
                    size="lg"
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Leaf className="mr-2 h-4 w-4" />
                    )}
                    添加到我的饲养
                  </Button>
                  <Button variant="outline" className="w-full" size="lg" onClick={handleShare}>
                    分享给朋友
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-cream-200">
                  <div className="flex items-center justify-between text-sm text-forest-600">
                    <span>分类</span>
                    <span className="font-medium text-forest-950">{species.subcategory}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}