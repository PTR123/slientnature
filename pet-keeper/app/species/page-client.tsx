'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Thermometer, Droplets, Search, Filter } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { cn } from '@/lib/utils';
import { getDifficultyLabel, getDifficultyColor } from '@/lib/utils';

export default function SpeciesPage() {
  const [species, setSpecies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadSpecies();
  }, [selectedCategory, searchQuery]);

  const loadSpecies = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getSpecies({
        category: selectedCategory || undefined,
        search: searchQuery || undefined
      });
      setSpecies(data);
    } catch (error) {
      console.error('Failed to load species:', error);
    } finally {
      setLoading(false);
    }
  };

  // ... 其余代码保持不变，只修改数据加载部分
}