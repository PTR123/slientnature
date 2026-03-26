'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

export default function CreateSpeciesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    scientificName: '',
    category: 'insect',
    subcategory: '',
    image: '',
    difficulty: 'beginner',
    temperatureMin: 25,
    temperatureMax: 30,
    humidityMin: 60,
    humidityMax: 80,
    lifespan: '',
    origin: '',
    diet: [] as string[],
    feedingFrequency: '',
    enclosureSize: '',
    substrate: [] as string[],
    decor: [] as string[],
    lifecycle: [] as string[],
    diseases: [] as any[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.scientificName) {
      alert('请填写物种名称和学名');
      return;
    }

    try {
      setSubmitting(true);
      await apiClient.createSpecies(formData);
      alert('物种创建成功！');
      router.push('/admin');
    } catch (error: any) {
      alert(error.message || '创建失败');
    } finally {
      setSubmitting(false);
    }
  };

  if (!user || user.role !== 'admin') {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="bg-white border-b border-cream-200">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-forest-600 hover:text-forest-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回管理后台
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>添加新物种</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 基本信息 */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-forest-950 mb-1">
                    物种名称 *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-forest-950 mb-1">
                    学名 *
                  </label>
                  <input
                    type="text"
                    value={formData.scientificName}
                    onChange={(e) => setFormData({ ...formData, scientificName: e.target.value })}
                    className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-forest-950 mb-1">
                    分类
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                  >
                    <option value="insect">昆虫</option>
                    <option value="reptile">爬行</option>
                    <option value="aquatic">水族</option>
                    <option value="bird">鸟类</option>
                    <option value="exotic">异宠</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-forest-950 mb-1">
                    子分类
                  </label>
                  <input
                    type="text"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                    placeholder="如：守宫、蜘蛛等"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-forest-950 mb-1">
                    难度等级
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                  >
                    <option value="beginner">新手友好</option>
                    <option value="intermediate">进阶玩家</option>
                    <option value="advanced">专业玩家</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-forest-950 mb-1">
                    图片 URL
                  </label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                    placeholder="https://..."
                  />
                </div>
              </div>

              {/* 环境参数 */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-forest-950 mb-1">
                    温度范围 (°C)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={formData.temperatureMin}
                      onChange={(e) => setFormData({ ...formData, temperatureMin: parseInt(e.target.value) })}
                      className="flex-1 px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                      placeholder="最低"
                    />
                    <span className="flex items-center">-</span>
                    <input
                      type="number"
                      value={formData.temperatureMax}
                      onChange={(e) => setFormData({ ...formData, temperatureMax: parseInt(e.target.value) })}
                      className="flex-1 px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                      placeholder="最高"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-forest-950 mb-1">
                    湿度范围 (%)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={formData.humidityMin}
                      onChange={(e) => setFormData({ ...formData, humidityMin: parseInt(e.target.value) })}
                      className="flex-1 px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                      placeholder="最低"
                    />
                    <span className="flex items-center">-</span>
                    <input
                      type="number"
                      value={formData.humidityMax}
                      onChange={(e) => setFormData({ ...formData, humidityMax: parseInt(e.target.value) })}
                      className="flex-1 px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                      placeholder="最高"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-forest-950 mb-1">
                    寿命
                  </label>
                  <input
                    type="text"
                    value={formData.lifespan}
                    onChange={(e) => setFormData({ ...formData, lifespan: e.target.value })}
                    className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                    placeholder="如：5-10年"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-forest-950 mb-1">
                    原产地
                  </label>
                  <input
                    type="text"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                    placeholder="如：澳大利亚"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-forest-950 mb-1">
                    喂食频率
                  </label>
                  <input
                    type="text"
                    value={formData.feedingFrequency}
                    onChange={(e) => setFormData({ ...formData, feedingFrequency: e.target.value })}
                    className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                    placeholder="如：每周2-3次"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-forest-950 mb-1">
                    饲养容器大小
                  </label>
                  <input
                    type="text"
                    value={formData.enclosureSize}
                    onChange={(e) => setFormData({ ...formData, enclosureSize: e.target.value })}
                    className="w-full px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                    placeholder="如：40x30x30cm"
                  />
                </div>
              </div>

              {/* 提交按钮 */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  取消
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      创建中...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      创建物种
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}