'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';
import { calculateAge, formatDate } from '@/lib/utils';

export default function MyPetsClient() {
  const { user } = useAuth();
  const router = useRouter();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    loadPets();
  }, [user]);

  const loadPets = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getPets();
      setPets(data);
    } catch (error) {
      console.error('Failed to load pets:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-forest-600">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 botanical-pattern">
      <div className="bg-white border-b border-cream-200">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-4xl font-bold text-forest-950 mb-2">
                我的饲养记录
              </h1>
              <p className="text-forest-600">管理你的异宠档案，记录成长点滴</p>
            </div>
            <Link href="/my-pets/create">
              <Button size="lg">
                <Plus className="mr-2 h-4 w-4" />
                创建档案
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {pets.length === 0 ? (
          <Card className="p-12 text-center">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-forest-300" />
            <h3 className="font-display text-xl font-semibold text-forest-950 mb-2">
              还没有宠物档案
            </h3>
            <p className="text-forest-600 mb-4">创建你的第一个宠物档案吧</p>
            <Link href="/my-pets/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                创建档案
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pets.map((pet: any) => (
              <Link key={pet.id} href={`/my-pets/${pet.id}`}>
                <Card className="overflow-hidden hover-lift h-full group">
                  <div className="relative h-56 overflow-hidden">
                    {pet.image && (
                      <Image
                        src={pet.image}
                        alt={pet.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="font-display font-semibold text-2xl mb-1">{pet.name}</h3>
                      <p className="text-sm text-white/80">{pet.species}</p>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm text-forest-600">年龄</p>
                        <p className="font-semibold text-forest-950">{calculateAge(pet.birthDate)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-forest-600">最近记录</p>
                        <p className="font-semibold text-forest-950">
                          {pet.records?.[0] ? formatDate(pet.records[0].date) : formatDate(pet.acquisitionDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-cream-200">
                      <span className="text-sm text-forest-600">
                        {pet.records?.length || 0} 条记录
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}