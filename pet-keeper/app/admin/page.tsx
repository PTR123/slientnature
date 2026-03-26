'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/api';
import {
  Users,
  FileText,
  MessageCircle,
  Leaf,
  Settings,
  UserX,
  UserCheck,
  Trash2,
  Shield,
  BarChart3
} from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalPosts: number;
  totalComments: number;
  totalSpecies: number;
}

interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  role: string;
  isBanned: boolean;
  createdAt: string;
  _count: {
    posts: number;
    comments: number;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'species'>('overview');

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, usersData] = await Promise.all([
        apiClient.getAdminStats(),
        apiClient.getAllUsers()
      ]);
      setStats(statsData);
      setUsers(usersData);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBan = async (userId: string, isBanned: boolean) => {
    try {
      await apiClient.toggleUserBan(userId, !isBanned);
      loadData();
    } catch (error: any) {
      alert(error.message || '操作失败');
    }
  };

  const handleToggleRole = async (userId: string, role: string) => {
    try {
      const newRole = role === 'admin' ? 'user' : 'admin';
      await apiClient.updateUserRole(userId, newRole);
      loadData();
    } catch (error: any) {
      alert(error.message || '操作失败');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-forest-600">加载中...</div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="bg-white border-b border-cream-200">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-forest-600" />
            <div>
              <h1 className="font-display text-2xl font-bold text-forest-950">管理后台</h1>
              <p className="text-sm text-forest-600">管理物种、用户和社区内容</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'overview' ? 'default' : 'outline'}
            onClick={() => setActiveTab('overview')}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            概览
          </Button>
          <Button
            variant={activeTab === 'users' ? 'default' : 'outline'}
            onClick={() => setActiveTab('users')}
          >
            <Users className="h-4 w-4 mr-2" />
            用户管理
          </Button>
          <Button
            variant={activeTab === 'species' ? 'default' : 'outline'}
            onClick={() => setActiveTab('species')}
          >
            <Leaf className="h-4 w-4 mr-2" />
            物种管理
          </Button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-forest-100 rounded-lg">
                    <Users className="h-6 w-6 text-forest-600" />
                  </div>
                  <div>
                    <p className="text-sm text-forest-600">总用户数</p>
                    <p className="text-2xl font-bold text-forest-950">{stats.totalUsers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-forest-600">总帖子数</p>
                    <p className="text-2xl font-bold text-forest-950">{stats.totalPosts}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <MessageCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-forest-600">总评论数</p>
                    <p className="text-2xl font-bold text-forest-950">{stats.totalComments}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-terracotta-100 rounded-lg">
                    <Leaf className="h-6 w-6 text-terracotta-600" />
                  </div>
                  <div>
                    <p className="text-sm text-forest-600">物种数量</p>
                    <p className="text-2xl font-bold text-forest-950">{stats.totalSpecies}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <Card>
            <CardHeader>
              <CardTitle>用户管理</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-cream-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-forest-600">用户</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-forest-600">邮箱</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-forest-600">角色</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-forest-600">状态</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-forest-600">统计</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-forest-600">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b border-cream-200">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="font-medium text-forest-950">{u.username}</div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-forest-600">{u.email}</td>
                        <td className="py-3 px-4">
                          <Badge variant={u.role === 'admin' ? 'default' : 'outline'}>
                            {u.role === 'admin' ? '管理员' : '普通用户'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={u.isBanned ? 'destructive' : 'secondary'}>
                            {u.isBanned ? '已禁言' : '正常'}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-forest-600">
                          {u._count.posts} 帖子 / {u._count.comments} 评论
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2 justify-end">
                            {u.id !== user.id && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleToggleRole(u.id, u.role)}
                                >
                                  {u.role === 'admin' ? (
                                    <>
                                      <UserCheck className="h-3 w-3 mr-1" />
                                      降为用户
                                    </>
                                  ) : (
                                    <>
                                      <Shield className="h-3 w-3 mr-1" />
                                      设为管理员
                                    </>
                                  )}
                                </Button>
                                <Button
                                  variant={u.isBanned ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => handleToggleBan(u.id, u.isBanned)}
                                >
                                  {u.isBanned ? (
                                    <>
                                      <UserCheck className="h-3 w-3 mr-1" />
                                      解禁
                                    </>
                                  ) : (
                                    <>
                                      <UserX className="h-3 w-3 mr-1" />
                                      禁言
                                    </>
                                  )}
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Species Tab */}
        {activeTab === 'species' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>物种管理</CardTitle>
                <Button onClick={() => router.push('/admin/species/create')}>
                  <Leaf className="h-4 w-4 mr-2" />
                  添加物种
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Leaf className="h-12 w-12 text-forest-300 mx-auto mb-4" />
                <p className="text-forest-600 mb-2">物种编辑功能</p>
                <p className="text-sm text-forest-500">
                  前往 <a href="/species" className="text-forest-700 underline">物种图鉴</a> 查看，
                  或点击上方按钮添加新物种
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}