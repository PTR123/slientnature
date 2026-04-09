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
  BarChart3,
  Package,
  Folder,
  ShoppingCart,
  Edit,
  Search,
  AlertCircle
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

interface Species {
  id: string;
  name: string;
  scientificName: string;
  category: string;
  subcategory: string;
  image: string;
  difficulty: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [speciesList, setSpeciesList] = useState<Species[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'species' | 'shop' | 'orders'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const loadSpecies = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getSpecies();
      setSpeciesList(data);
    } catch (error) {
      console.error('Failed to load species:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'species') {
      loadSpecies();
    }
  }, [activeTab]);

  const handleDeleteSpecies = async (speciesId: string, speciesName: string) => {
    if (!confirm(`确定要删除物种"${speciesName}"吗？此操作不可撤销。`)) {
      return;
    }

    try {
      setDeletingId(speciesId);
      await apiClient.deleteSpecies(speciesId);
      alert('物种删除成功！');
      loadSpecies();
      // 刷新统计数据
      const statsData = await apiClient.getAdminStats();
      setStats(statsData);
    } catch (error: any) {
      alert(error.message || '删除失败');
    } finally {
      setDeletingId(null);
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
          <Button
            variant={activeTab === 'shop' ? 'default' : 'outline'}
            onClick={() => setActiveTab('shop')}
          >
            <Package className="h-4 w-4 mr-2" />
            商城管理
          </Button>
          <Button
            variant={activeTab === 'orders' ? 'default' : 'outline'}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            订单管理
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
              {/* 搜索框 */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-forest-400" />
                  <input
                    type="text"
                    placeholder="搜索物种名称或学名..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-cream-300 bg-white focus:outline-none focus:ring-2 focus:ring-forest-500"
                  />
                </div>
              </div>

              {/* 物种列表 */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="text-forest-600">加载中...</div>
                </div>
              ) : speciesList.length === 0 ? (
                <div className="text-center py-12">
                  <Leaf className="h-12 w-12 text-forest-300 mx-auto mb-4" />
                  <p className="text-forest-600 mb-2">暂无物种数据</p>
                  <p className="text-sm text-forest-500">
                    点击上方"添加物种"按钮创建第一个物种
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-cream-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-forest-600">物种</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-forest-600">分类</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-forest-600">难度</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-forest-600">创建时间</th>
                        <th className="text-right py-3 px-4 text-sm font-medium text-forest-600">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {speciesList
                        .filter(s =>
                          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.scientificName.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((species) => (
                          <tr key={species.id} className="border-b border-cream-200 hover:bg-cream-50">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                {species.image && (
                                  <img
                                    src={species.image}
                                    alt={species.name}
                                    className="w-12 h-12 object-cover rounded-lg"
                                  />
                                )}
                                <div>
                                  <div className="font-medium text-forest-950">{species.name}</div>
                                  <div className="text-sm text-forest-500 italic">{species.scientificName}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="text-sm text-forest-600">{species.subcategory}</div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge
                                variant={
                                  species.difficulty === 'beginner' ? 'default' :
                                  species.difficulty === 'intermediate' ? 'secondary' : 'destructive'
                                }
                              >
                                {species.difficulty === 'beginner' && '新手友好'}
                                {species.difficulty === 'intermediate' && '进阶玩家'}
                                {species.difficulty === 'advanced' && '专业玩家'}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-sm text-forest-600">
                              {new Date(species.createdAt).toLocaleDateString('zh-CN')}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex gap-2 justify-end">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => router.push(`/species/${species.id}`)}
                                >
                                  <Edit className="h-3 w-3 mr-1" />
                                  查看
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDeleteSpecies(species.id, species.name)}
                                  disabled={deletingId === species.id}
                                >
                                  {deletingId === species.id ? (
                                    <span className="flex items-center">
                                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                                      删除中...
                                    </span>
                                  ) : (
                                    <>
                                      <Trash2 className="h-3 w-3 mr-1" />
                                      删除
                                    </>
                                  )}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Shop Tab */}
        {activeTab === 'shop' && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  商品管理
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-forest-600 mb-4">
                  管理商城中的所有商品信息，包括上架、下架、编辑等操作
                </p>
                <Button
                  className="w-full"
                  onClick={() => router.push('/admin/products')}
                >
                  进入商品管理
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Folder className="h-5 w-5" />
                  分类管理
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-forest-600 mb-4">
                  管理商品分类，包括添加、编辑、删除和排序
                </p>
                <Button
                  className="w-full"
                  onClick={() => router.push('/admin/categories')}
                >
                  进入分类管理
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  订单管理
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-forest-600 mb-4">
                  查看所有用户订单，处理发货，管理订单状态
                </p>
                <Button
                  className="w-full"
                  onClick={() => router.push('/admin/orders')}
                >
                  进入订单管理
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  订单统计
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-forest-600 mb-4">
                  查看订单数据统计，了解销售情况和订单状态分布
                </p>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => router.push('/admin/orders')}
                >
                  查看统计
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}