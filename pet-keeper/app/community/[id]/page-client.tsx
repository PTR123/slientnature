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
import { ArrowLeft, Heart, MessageCircle, Share2, Send, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function PostDetailClient({ postId }: { postId: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadPost();
  }, [postId]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getPostById(postId);
      setPost(data);
      // 检查当前用户是否已点赞
      if (user && data.likes) {
        setLiked(data.likes.some((like: any) => like.userId === user.id));
      }
    } catch (error) {
      console.error('Failed to load post:', error);
      router.push('/community');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLike = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      const result = await apiClient.toggleLike(postId);
      setLiked(result.liked);
      loadPost(); // 重新加载帖子以更新点赞数
    } catch (error: any) {
      alert(error.message || '操作失败');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }

    if (!commentText.trim()) {
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.addComment(postId, commentText);
      setCommentText('');
      loadPost(); // 重新加载帖子以显示新评论
    } catch (error: any) {
      alert(error.message || '评论失败');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async () => {
    if (!confirm('确定要删除这篇帖子吗？')) return;

    try {
      if (user?.role === 'admin') {
        await apiClient.deletePostAsAdmin(postId);
      } else {
        await apiClient.deletePost(postId);
      }
      router.push('/community');
    } catch (error: any) {
      alert(error.message || '删除失败');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('确定要删除这条评论吗？')) return;

    try {
      await apiClient.deleteCommentAsAdmin(commentId);
      loadPost();
    } catch (error: any) {
      alert(error.message || '删除失败');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: `${post.author?.username} 分享了一篇帖子：${post.title}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        // 使用原生分享 API（移动端）
        await navigator.share(shareData);
      } else {
        // 桌面端：复制链接到剪贴板
        await navigator.clipboard.writeText(window.location.href);
        alert('链接已复制到剪贴板！');
      }
    } catch (error: any) {
      // 用户取消分享不需要提示
      if (error.name !== 'AbortError') {
        console.error('分享失败:', error);
        alert('分享失败，请重试');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-forest-600">加载中...</div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="bg-white border-b border-cream-200">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/community" className="inline-flex items-center text-forest-600 hover:text-forest-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回社区
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-4xl">
        <Card>
          {post.image && (
            <div className="relative aspect-video">
              <Image src={post.image} alt={post.title} fill className="object-cover" />
            </div>
          )}

          <CardContent className="p-6">
            {/* Author Info */}
            <div className="flex items-center gap-3 mb-4">
              {post.author?.avatar && (
                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                  <Image src={post.author.avatar} alt={post.author.username} fill className="object-cover" />
                </div>
              )}
              <div>
                <p className="font-semibold text-forest-950">{post.author?.username}</p>
                <p className="text-sm text-forest-600">{formatDate(post.createdAt)}</p>
              </div>
            </div>

            {/* Title */}
            <h1 className="font-display text-3xl font-bold text-forest-950 mb-4">
              {post.title}
            </h1>

            {/* Tags */}
            {post.tags && (
              <div className="flex flex-wrap gap-2 mb-4">
                {JSON.parse(post.tags).map((tag: string) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Content */}
            <div className="prose prose-forest max-w-none mb-6">
              <p className="text-forest-800 leading-relaxed whitespace-pre-wrap">{post.content}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-6 border-t border-cream-200">
              <Button
                variant={liked ? 'default' : 'outline'}
                onClick={handleToggleLike}
              >
                <Heart className={`h-4 w-4 mr-2 ${liked ? 'fill-current' : ''}`} />
                点赞 ({post._count?.likes || 0})
              </Button>
              <Button variant="outline">
                <MessageCircle className="h-4 w-4 mr-2" />
                评论 ({post._count?.comments || 0})
              </Button>
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                分享
              </Button>
              {(user?.role === 'admin' || post.authorId === user?.id) && (
                <Button variant="outline" onClick={handleDeletePost}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  删除
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Comments Section */}
        <Card className="mt-6">
          <CardContent className="p-6">
            <h2 className="font-display text-xl font-semibold text-forest-950 mb-4">
              评论 ({post.comments?.length || 0})
            </h2>

            {/* Add Comment Form */}
            {user ? (
              <form onSubmit={handleAddComment} className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="写下你的评论..."
                    className="flex-1 px-4 py-2 border border-cream-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500"
                  />
                  <Button type="submit" disabled={submitting || !commentText.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            ) : (
              <div className="mb-6 p-4 bg-forest-50 rounded-lg text-center">
                <p className="text-forest-700">
                  <Link href="/login" className="text-forest-900 font-semibold hover:underline">
                    登录
                  </Link>
                  后参与评论
                </p>
              </div>
            )}

            {/* Comments List */}
            {!post.comments || post.comments.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-forest-300 mx-auto mb-4" />
                <p className="text-forest-600">暂无评论，来说点什么吧~</p>
              </div>
            ) : (
              <div className="space-y-4">
                {post.comments.map((comment: any) => (
                  <div key={comment.id} className="border-b border-cream-200 pb-4">
                    <div className="flex items-start gap-3">
                      {comment.user?.avatar && (
                        <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                          <Image
                            src={comment.user.avatar}
                            alt={comment.user.username}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-forest-950">
                              {comment.user?.username}
                            </span>
                            <span className="text-xs text-forest-600">
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>
                          {user?.role === 'admin' && (
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              删除
                            </button>
                          )}
                        </div>
                        <p className="text-forest-800">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}