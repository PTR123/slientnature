import SpeciesDetailClient from './page-client';
import { apiClient } from '@/lib/api';
import { notFound } from 'next/navigation';

interface SpeciesDetailPageProps {
  params: {
    id: string;
  };
}

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

// 这个函数在服务器端执行，用于获取物种数据
async function getSpecies(id: string) {
  try {
    // 在服务器端直接调用API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/species/${id}`, {
      cache: 'no-store' // 不缓存，确保数据最新
    });

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch species:', error);
    return null;
  }
}

export default async function SpeciesDetailPage({ params }: SpeciesDetailPageProps) {
  const species = await getSpecies(params.id);

  if (!species) {
    notFound();
  }

  // 转换数据格式以匹配客户端组件的期望
  const formattedSpecies = {
    id: species.id,
    name: species.name,
    scientificName: species.scientificName,
    image: species.image || '/images/default-species.png',
    category: species.category,
    subcategory: species.subcategory,
    difficulty: species.difficulty,
    temperature: {
      min: species.temperatureMin,
      max: species.temperatureMax
    },
    humidity: {
      min: species.humidityMin,
      max: species.humidityMax
    },
    lifespan: species.lifespan,
    origin: species.origin,
    diet: parseJsonArray(species.diet),
    feedingFrequency: species.feedingFrequency,
    enclosure: {
      size: species.enclosureSize,
      substrate: parseJsonArray(species.substrate),
      decor: parseJsonArray(species.decor)
    },
    lifecycle: parseJsonArray(species.lifecycle),
    diseases: parseJsonArray(species.diseases)
  };

  return <SpeciesDetailClient species={formattedSpecies} />;
}