import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Leaf,
  BookOpen,
  Calendar,
  Users,
  Thermometer,
  Droplets,
  ArrowRight
} from 'lucide-react';
import { speciesData } from '@/lib/data';
import { mockPosts } from '@/lib/mock-data';

export default function HomePage() {
  const featuredSpecies = speciesData.slice(0, 4);
  const featuredPosts = mockPosts.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest-50 via-cream-50 to-amber-50 botanical-pattern">
        <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Text Content */}
            <div className="animate-in">
              <div className="inline-flex items-center rounded-full border border-forest-200 bg-white px-4 py-1.5 text-sm text-forest-700 mb-6">
                <Leaf className="mr-2 h-3.5 w-3.5" />
                专业异宠管理平台
              </div>
              <h1 className="font-display text-5xl font-bold tracking-tight text-forest-950 sm:text-6xl lg:text-7xl mb-6">
                科学饲养
                <span className="block text-forest-600">记录成长</span>
              </h1>
              <p className="text-lg text-forest-700 mb-8 max-w-xl">
                物种图鉴、饲养记录、社区交流三位一体，让每一只异宠都能得到专业的照料与关注
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/species">
                    开始探索
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/my-pets">我的饲养记录</Link>
                </Button>
              </div>
            </div>

            {/* Hero Image Grid */}
            <div className="relative animate-in-delay-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg hover-lift">
                    <Image
                      src="https://images.unsplash.com/photo-1559253664-ca249d4608c6?w=800"
                      alt="甲虫"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg hover-lift">
                    <Image
                      src="https://images.unsplash.com/photo-1518709764753-9c4078dcfcc5?w=800"
                      alt="守宫"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="relative h-64 rounded-2xl overflow-hidden shadow-lg hover-lift">
                    <Image
                      src="https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=800"
                      alt="螳螂"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg hover-lift">
                    <Image
                      src="https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?w=800"
                      alt="观赏虾"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-px left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto"
          >
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl font-bold text-forest-950 sm:text-4xl mb-4">
              核心功能
            </h2>
            <p className="text-lg text-forest-600 max-w-2xl mx-auto">
              从物种认知到饲养实践，从个体记录到社区分享，全方位满足异宠爱好者的需求
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Species Guide */}
            <Card className="border-2 border-forest-100 hover:border-forest-300 transition-all hover-lift">
              <CardContent className="p-8">
                <div className="rounded-xl bg-forest-100 w-14 h-14 flex items-center justify-center mb-6">
                  <BookOpen className="h-7 w-7 text-forest-600" />
                </div>
                <h3 className="font-display text-xl font-semibold text-forest-950 mb-3">
                  物种图鉴
                </h3>
                <p className="text-forest-600 mb-4">
                  专业的异宠数据库，涵盖昆虫、爬宠、水族等多种类型，提供详细的饲养指南
                </p>
                <ul className="space-y-2 text-sm text-forest-700">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-forest-500 mr-2" />
                    环境参数建议
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-forest-500 mr-2" />
                    生命周期图示
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-forest-500 mr-2" />
                    疾病处理指南
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* My Records */}
            <Card className="border-2 border-amber-100 hover:border-amber-300 transition-all hover-lift">
              <CardContent className="p-8">
                <div className="rounded-xl bg-amber-100 w-14 h-14 flex items-center justify-center mb-6">
                  <Calendar className="h-7 w-7 text-amber-600" />
                </div>
                <h3 className="font-display text-xl font-semibold text-forest-950 mb-3">
                  饲养记录
                </h3>
                <p className="text-forest-600 mb-4">
                  为每只宠物建立独立档案，记录蜕皮、喂食、体重等关键事件，见证成长历程
                </p>
                <ul className="space-y-2 text-sm text-forest-700">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2" />
                    个体档案管理
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2" />
                    事件时间轴
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2" />
                    数据统计分析
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Community */}
            <Card className="border-2 border-moss-100 hover:border-moss-300 transition-all hover-lift">
              <CardContent className="p-8">
                <div className="rounded-xl bg-moss-100 w-14 h-14 flex items-center justify-center mb-6">
                  <Users className="h-7 w-7 text-moss-600" />
                </div>
                <h3 className="font-display text-xl font-semibold text-forest-950 mb-3">
                  社区交流
                </h3>
                <p className="text-forest-600 mb-4">
                  与志同道合的异宠爱好者分享经验、交流心得，共同成长
                </p>
                <ul className="space-y-2 text-sm text-forest-700">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-moss-500 mr-2" />
                    图文发帖分享
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-moss-500 mr-2" />
                    经验交流互动
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-moss-500 mr-2" />
                    问答求助专区
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Species */}
      <section className="py-20 bg-cream-50 botanical-pattern">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-display text-3xl font-bold text-forest-950 sm:text-4xl mb-2">
                热门物种
              </h2>
              <p className="text-forest-600">探索最受欢迎的异宠品种</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/species">
                查看全部
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredSpecies.map((species) => (
              <Link key={species.id} href={`/species/${species.id}`}>
                <Card className="overflow-hidden hover-lift h-full">
                  <div className="relative h-48">
                    <Image
                      src={species.image}
                      alt={species.name}
                      fill
                      className="object-cover"
                    />
                    <Badge
                      variant={species.difficulty}
                      className="absolute top-3 right-3"
                    >
                      {species.difficulty === 'beginner' && '新手友好'}
                      {species.difficulty === 'intermediate' && '进阶玩家'}
                      {species.difficulty === 'advanced' && '专业玩家'}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-display font-semibold text-lg text-forest-950 mb-1">
                      {species.name}
                    </h3>
                    <p className="text-sm text-forest-600 italic mb-3">
                      {species.scientificName}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-forest-700">
                      <div className="flex items-center">
                        <Thermometer className="h-3.5 w-3.5 mr-1" />
                        {species.temperature.min}-{species.temperature.max}°C
                      </div>
                      <div className="flex items-center">
                        <Droplets className="h-3.5 w-3.5 mr-1" />
                        {species.humidity.min}-{species.humidity.max}%
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Community Preview */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-display text-3xl font-bold text-forest-950 sm:text-4xl mb-2">
                社区动态
              </h2>
              <p className="text-forest-600">看看大家都在分享什么</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/community">
                更多帖子
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {featuredPosts.map((post) => (
              <Link key={post.id} href={`/community/${post.id}`}>
                <Card className="overflow-hidden hover-lift h-full">
                  <div className="relative h-48">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden">
                        <Image
                          src={post.authorAvatar}
                          alt={post.author}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-sm font-medium text-forest-700">
                        {post.author}
                      </span>
                    </div>
                    <h3 className="font-display font-semibold text-forest-950 mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-forest-600">
                      <span>{post.likes} 赞</span>
                      <span>{post.comments} 评论</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-forest-600 to-forest-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl font-bold sm:text-4xl mb-4">
            开始你的异宠饲养之旅
          </h2>
          <p className="text-lg text-forest-100 mb-8 max-w-2xl mx-auto">
            加入我们，探索异宠世界的奇妙，记录每一个珍贵的成长瞬间
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/species">浏览物种库</Link>
            </Button>
            <Button size="lg" className="bg-white text-forest-700 hover:bg-cream-100" asChild>
              <Link href="/my-pets">创建记录</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}