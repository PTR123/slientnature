'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/components/auth-provider';
import { ArrowLeft, Plus, Edit, Trash2, Activity, Utensils, Scale, Droplet, Heart } from 'lucide-react';
import { formatDate, calculateAge } from '@/lib/utils';

const eventIcons = {
  molt: Activity,
  feeding: Utensils,
  weighing: Scale,
  water_change: Droplet,
  treatment: Heart,
  breeding: Heart,
  other: Activity
};

const eventLabels = {
  molt: '蜕皮',
  feeding: '喂食',
  weighing: '称重',
  water_change: '换水',
  treatment: '治疗',
  breeding: '繁殖',
  other: '其他'
};

export default function PetDetailClient({ petId }: { petId: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [recordForm, setRecordForm] = useState({
    type: 'feeding',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    image: '',
    weight: '',
    length: ''
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadPet();
  }, [user, petId]);

  const loadPet = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getPetById(petId);
      setPet(data);
    } catch (error) {
      console.error('Failed to load pet:', error);
      router.push('/my-pets');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('确定要删除这个宠物档案吗？此操作无法撤销。')) {
      return;
    }

    try {
      await apiClient.deletePet(petId);
      router.push('/my-pets');
    } catch (error: any) {
      alert(error.message || '删除失败');
    }
  };

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient.addRecord(petId, {
        ...recordForm,
        weight: recordForm.weight ? parseFloat(recordForm.weight) : undefined,
        length: recordForm.length ? parseFloat(recordForm.length) : undefined
      });
      setShowAddRecord(false);
      setRecordForm({
        type: 'feeding',
        date: new Date().toISOString().split('T')[0],
        notes: '',
        image: '',
        weight: '',
        length: ''
      });
      loadPet();
    } catch (error: any) {
      alert(error.message || '添加记录失败');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-forest-600">加载中...</div>
      </div>
    );
  }

  if (!pet) {
    return null;
  }

  return (
    <div className="min-h-screen bg-cream-50">
      {pet.image && (
        <Image
          src={pet.image}
          alt={pet.name}
          fill
          className="object-cover opacity-40"
        />
      )}

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Link href="/my-pets" className="inline-flex items-center text-white hover:text-cream-100 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回列表
          </Link>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Pet Info Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  {pet.image && (
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-6">
                      <Image
                        src={pet.image}
                        alt={pet.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <h2 className="font-display text-2xl font-bold text-forest-950 mb-4">
                    {pet.name}
                  </h2>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-cream-200">
                      <span className="text-sm text-forest-600">物种</span>
                      <span className="text-sm font-medium text-forest-950">{pet.species}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-cream-200">
                      <span className="text-sm text-forest-600">年龄</span>
                      <span className="text-sm font-medium text-forest-950">
                        {calculateAge(pet.birthDate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-cream-200">
                      <span className="text-sm text-forest-600">生日</span>
                      <span className="text-sm font-medium text-forest-950">
                        {formatDate(pet.birthDate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-cream-200">
                      <span className="text-sm text-forest-600">入手日期</span>
                      <span className="text-sm font-medium text-forest-950">
                        {formatDate(pet.acquisitionDate)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <Button onClick={() => setShowAddRecord(true)} className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      添加记录
                    </Button>
                    <div className="flex gap-2">
                      <Link href={`/my-pets/${petId}/edit`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          <Edit className="mr-2 h-4 w-4" />
                          编辑
                        </Button>
                      </Link>
                      <Button variant="outline" className="flex-1 text-red-600" onClick={handleDelete}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        删除
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Records Timeline */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display text-xl font-semibold text-forest-950">
                      事件记录
                    </h2>
                    <Badge>{pet.records?.length || 0} 条记录</Badge>
                  </div>

                  {!pet.records || pet.records.length === 0 ? (
                    <div className="text-center py-12">
                      <Activity className="h-12 w-12 text-forest-300 mx-auto mb-4" />
                      <p className="text-forest-600 mb-4">还没有任何记录</p>
                      <Button onClick={() => setShowAddRecord(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        添加第一条记录
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pet.records.map((record: any) => {
                        const Icon = eventIcons[record.type] || Activity;
                        return (
                          <div key={record.id} className="border border-cream-200 rounded-lg p-4">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 rounded-lg bg-forest-100 flex items-center justify-center flex-shrink-0">
                                <Icon className="h-6 w-6 text-forest-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <Badge variant="outline">{eventLabels[record.type]}</Badge>
                                    <p className="text-sm text-forest-600 mt-1">
                                      {formatDate(record.date)}
                                    </p>
                                  </div>
                                  {record.weight && (
                                    <Badge variant="secondary">{record.weight}g</Badge>
                                  )}
                                </div>
                                {record.image && (
                                  <div className="relative w-full h-48 rounded-lg overflow-hidden mb-3">
                                    <Image src={record.image} alt={record.notes} fill className="object-cover" />
                                  </div>
                                )}
                                <p className="text-forest-950">{record.notes}</p>
                                {record.length && (
                                  <p className="text-sm text-forest-600 mt-2">
                                    体长: {record.length}cm
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Add Record Modal */}
      {showAddRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <h3 className="font-display text-xl font-semibold mb-4">添加记录</h3>
              <form onSubmit={handleAddRecord} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-1">类型</label>
                  <select
                    value={recordForm.type}
                    onChange={(e) => setRecordForm({ ...recordForm, type: e.target.value })}
                    className="w-full px-4 py-2 border border-cream-300 rounded-lg"
                  >
                    <option value="feeding">喂食</option>
                    <option value="molt">蜕皮</option>
                    <option value="weighing">称重</option>
                    <option value="water_change">换水</option>
                    <option value="treatment">治疗</option>
                    <option value="breeding">繁殖</option>
                    <option value="other">其他</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-1">日期</label>
                  <input
                    type="date"
                    value={recordForm.date}
                    onChange={(e) => setRecordForm({ ...recordForm, date: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-cream-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-1">备注</label>
                  <textarea
                    value={recordForm.notes}
                    onChange={(e) => setRecordForm({ ...recordForm, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-cream-300 rounded-lg"
                    placeholder="记录详情..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-forest-700 mb-1">图片URL（可选）</label>
                  <input
                    type="url"
                    value={recordForm.image}
                    onChange={(e) => setRecordForm({ ...recordForm, image: e.target.value })}
                    className="w-full px-4 py-2 border border-cream-300 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-forest-700 mb-1">体重(g)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={recordForm.weight}
                      onChange={(e) => setRecordForm({ ...recordForm, weight: e.target.value })}
                      className="w-full px-4 py-2 border border-cream-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-forest-700 mb-1">体长(cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={recordForm.length}
                      onChange={(e) => setRecordForm({ ...recordForm, length: e.target.value })}
                      className="w-full px-4 py-2 border border-cream-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">添加</Button>
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setShowAddRecord(false)}>
                    取消
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}