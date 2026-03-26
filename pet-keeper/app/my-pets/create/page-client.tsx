'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/components/auth-provider';
import { ArrowLeft, Upload, X } from 'lucide-react';

export default function CreatePetClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    birthDate: '',
    acquisitionDate: '',
    image: ''
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // 从URL参数中获取物种信息
    const speciesParam = searchParams.get('species');
    const speciesImageParam = searchParams.get('speciesImage');

    if (speciesParam) {
      setFormData(prev => ({ ...prev, species: speciesParam }));
    }
    if (speciesImageParam) {
      setFormData(prev => ({ ...prev, image: speciesImageParam }));
      setPreviewUrl(speciesImageParam);
    }
  }, [user, searchParams]);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 文件大小检查
    if (file.size > 5 * 1024 * 1024) {
      alert('文件大小不能超过 5MB');
      return;
    }

    // 文件类型检查
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('只支持 JPG、PNG、GIF、WebP 格式的图片');
      return;
    }

    // 预览图片
    const reader = new FileReader();
    reader.onload = (event) => {
      setPreviewUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);

    // 上传图片
    setUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append('image', file);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/api/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: uploadData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '上传失败');
      }

      const data = await response.json();
      setFormData(prev => ({ ...prev, image: `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${data.url}` }));
    } catch (error: any) {
      alert(error.message || '图片上传失败');
      setPreviewUrl('');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setPreviewUrl('');
    setFormData(prev => ({ ...prev, image: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 验证必填字段
    if (!formData.name.trim()) {
      alert('请输入宠物名字');
      return;
    }
    if (!formData.species.trim()) {
      alert('请输入物种名称');
      return;
    }

    // 日期验证
    const today = new Date().toISOString().split('T')[0];
    if (formData.birthDate > today) {
      alert('出生日期不能晚于今天');
      return;
    }
    if (formData.acquisitionDate > today) {
      alert('入手日期不能晚于今天');
      return;
    }

    setLoading(true);

    try {
      await apiClient.createPet(formData);
      router.push('/my-pets');
    } catch (error: any) {
      alert(error.message || '创建失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取今天的日期作为最大值
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-cream-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
        <Link href="/my-pets" className="inline-flex items-center text-forest-600 hover:text-forest-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          返回列表
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>创建宠物档案</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-forest-700 mb-1">
                  宠物名字 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                  placeholder="例如：小绿"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-forest-700 mb-1">
                  物种 *
                </label>
                <input
                  type="text"
                  value={formData.species}
                  onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                  placeholder="例如：豹纹守宫、彩虹锹甲、红腿陆龟等"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-forest-700 mb-1">
                  出生日期 *
                </label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  max={today}
                  required
                  className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-forest-700 mb-1">
                  入手日期 *
                </label>
                <input
                  type="date"
                  value={formData.acquisitionDate}
                  onChange={(e) => setFormData({ ...formData, acquisitionDate: e.target.value })}
                  max={today}
                  required
                  className="w-full px-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-forest-700 mb-2">
                  照片（可选）
                </label>

                {!previewUrl ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-cream-300 rounded-lg p-8 text-center cursor-pointer hover:border-forest-500 transition-colors"
                  >
                    <Upload className="h-12 w-12 text-forest-400 mx-auto mb-2" />
                    <p className="text-forest-600">点击上传照片</p>
                    <p className="text-sm text-forest-400 mt-1">支持 JPG、PNG、GIF（最大 5MB）</p>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                      <Image src={previewUrl} alt="预览" fill className="object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading || uploading}
              >
                {uploading ? '上传中...' : loading ? '创建中...' : '创建档案'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}