'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Plus } from 'lucide-react';
import { apiClient } from '@/lib/api';

export default function CommunityClient() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'trending' | 'latest'>('trending');

  useEffect(() => {
    loadPosts();
  }, [filter]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getPosts(filter);
      setPosts(data);
    } catch (error) {
      console.error('Failed to load posts:', error);
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
              <h1 className="font-display text-4xl font-bold text-forest-950 mb-2">社区</h1>
              <p className="text-forest-600">与异宠爱好者分享经验、交流心得</p>
            </div>
            <Link href="/community/create">
              <Button size="lg">
                <Plus className="mr-2 h-4 w-4" />
                发帖
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant={filter === 'trending' ? 'default' : 'outline'}
              onClick={() => setFilter('trending')}
            >
              热门
            </Button>
            <Button
              variant={filter === 'latest' ? 'default' : 'outline'}
              onClick={() => setFilter('latest')}
            >
              最新
            </Button>
          </div>
        </div>

        {posts.length === 0 ? (
          <Card className="p-12 text-center">
            <MessageCircle className="h-16 w-16 mx-auto mb-4 text-forest-300" />
            <h3 className="font-display text-xl font-semibold text-forest-950 mb-2">
              还没有帖子
            </h3>
            <p className="text-forest-600 mb-4">成为第一个发帖的人吧</p>
            <Link href="/community/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                发帖
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: any) => (
              <Link key={post.id} href={`/community/${post.id}`}>
                <Card className="overflow-hidden hover-lift h-full group">
                  {post.image && (
                    <div className="relative h-48">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {post.author?.avatar && (
                        <div className="relative w-8 h-8 rounded-full overflow-hidden">
                          <Image
                            src={post.author.avatar}
                            alt={post.author.username}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <span className="text-sm font-medium text-forest-700">
                        {post.author?.username || '匿名用户'}
                      </span>
                    </div>
                    <h3 className="font-display font-semibold text-forest-950 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-forest-600">
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {post._count?.likes || 0}
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {post._count?.comments || 0}
                      </div>
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