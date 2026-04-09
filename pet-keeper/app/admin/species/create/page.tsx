'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api';
import { ArrowLeft, Save, Loader2, Upload, X, Plus } from 'lucide-react';

export default function CreateSpeciesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
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
    diseases: [] as string[]
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const result = await apiClient.uploadImage(file);
      setFormData({ ...formData, image: result.url });
    } catch (error: any) {
      alert(error.message || '图片上传失败');
    } finally {
      setUploadingImage(false);
    }
  };

  const addArrayItem = (field: 'diet' | 'substrate' | 'decor' | 'lifecycle' | 'diseases', value: string) => {
    if (!value.trim()) return;
    setFormData({
      ...formData,
      [field]: [...formData[field], value.trim()]
    });
  };

  const removeArrayItem = (field: 'diet' | 'substrate' | 'decor' | 'lifecycle' | 'diseases', index: number) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index)
    });
  };

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
              <div>
                <h3 className="font-semibold text-lg mb-4 text-forest-950">基本信息</h3>
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
                      图片上传
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingImage}
                      className="w-full"
                    >
                      {uploadingImage ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      {uploadingImage ? '上传中...' : '选择图片'}
                    </Button>
                    {formData.image && (
                      <div className="mt-2 relative inline-block">
                        <img
                          src={formData.image}
                          alt="预览"
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, image: '' })}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 环境参数 */}
              <div>
                <h3 className="font-semibold text-lg mb-4 text-forest-950">环境参数</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-forest-950 mb-1">
                      温度范围 (°C)
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        value={formData.temperatureMin}
                        onChange={(e) => setFormData({ ...formData, temperatureMin: parseInt(e.target.value) || 0 })}
                        className="w-24 px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                        placeholder="最低"
                      />
                      <span className="text-forest-600 font-medium">-</span>
                      <input
                        type="number"
                        value={formData.temperatureMax}
                        onChange={(e) => setFormData({ ...formData, temperatureMax: parseInt(e.target.value) || 0 })}
                        className="w-24 px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                        placeholder="最高"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-forest-950 mb-1">
                      湿度范围 (%)
                    </label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        value={formData.humidityMin}
                        onChange={(e) => setFormData({ ...formData, humidityMin: parseInt(e.target.value) || 0 })}
                        className="w-24 px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                        placeholder="最低"
                      />
                      <span className="text-forest-600 font-medium">-</span>
                      <input
                        type="number"
                        value={formData.humidityMax}
                        onChange={(e) => setFormData({ ...formData, humidityMax: parseInt(e.target.value) || 0 })}
                        className="w-24 px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
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
              </div>

              {/* 饲养信息（数组字段） */}
              <div>
                <h3 className="font-semibold text-lg mb-4 text-forest-950">饲养信息</h3>
                <div className="space-y-4">
                  {/* 食物需求 */}
                  <div>
                    <label className="block text-sm font-medium text-forest-950 mb-2">
                      食物需求
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="输入食物类型，如：甲虫果冻"
                        className="flex-1 px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addArrayItem('diet', e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          addArrayItem('diet', input.value);
                          input.value = '';
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.diet.map((item, index) => (
                        <div
                          key={index}
                          className="inline-flex items-center gap-1 bg-forest-100 text-forest-900 px-3 py-1 rounded-lg text-sm"
                        >
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={() => removeArrayItem('diet', index)}
                            className="text-forest-700 hover:text-forest-900"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 底材 */}
                  <div>
                    <label className="block text-sm font-medium text-forest-950 mb-2">
                      底材推荐
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="输入底材类型，如：发酵木屑"
                        className="flex-1 px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addArrayItem('substrate', e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          addArrayItem('substrate', input.value);
                          input.value = '';
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.substrate.map((item, index) => (
                        <div
                          key={index}
                          className="inline-flex items-center gap-1 bg-forest-100 text-forest-900 px-3 py-1 rounded-lg text-sm"
                        >
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={() => removeArrayItem('substrate', index)}
                            className="text-forest-700 hover:text-forest-900"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 装饰 */}
                  <div>
                    <label className="block text-sm font-medium text-forest-950 mb-2">
                      装饰建议
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="输入装饰物，如：树皮"
                        className="flex-1 px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addArrayItem('decor', e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          addArrayItem('decor', input.value);
                          input.value = '';
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.decor.map((item, index) => (
                        <div
                          key={index}
                          className="inline-flex items-center gap-1 bg-forest-100 text-forest-900 px-3 py-1 rounded-lg text-sm"
                        >
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={() => removeArrayItem('decor', index)}
                            className="text-forest-700 hover:text-forest-900"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 生命周期 */}
                  <div>
                    <label className="block text-sm font-medium text-forest-950 mb-2">
                      生命周期
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="输入生命阶段，如：卵(30-45天)"
                        className="flex-1 px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addArrayItem('lifecycle', e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          addArrayItem('lifecycle', input.value);
                          input.value = '';
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.lifecycle.map((item, index) => (
                        <div
                          key={index}
                          className="inline-flex items-center gap-1 bg-forest-100 text-forest-900 px-3 py-1 rounded-lg text-sm"
                        >
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={() => removeArrayItem('lifecycle', index)}
                            className="text-forest-700 hover:text-forest-900"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 常见疾病 */}
                  <div>
                    <label className="block text-sm font-medium text-forest-950 mb-2">
                      常见疾病
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="输入疾病名称，如：螨虫感染"
                        className="flex-1 px-3 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addArrayItem('diseases', e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          addArrayItem('diseases', input.value);
                          input.value = '';
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.diseases.map((item, index) => (
                        <div
                          key={index}
                          className="inline-flex items-center gap-1 bg-terracotta-100 text-terracotta-900 px-3 py-1 rounded-lg text-sm"
                        >
                          <span>{item}</span>
                          <button
                            type="button"
                            onClick={() => removeArrayItem('diseases', index)}
                            className="text-terracotta-700 hover:text-terracotta-900"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 提交按钮 */}
              <div className="flex justify-end gap-4 pt-4 border-t border-cream-200">
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