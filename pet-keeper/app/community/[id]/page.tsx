import PostDetailClient from './page-client';

export default function PostDetailPage({ params }: { params: { id: string } }) {
  return <PostDetailClient postId={params.id} />;
}