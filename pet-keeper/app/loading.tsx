export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 to-cream-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-forest-600 mx-auto mb-4"></div>
        <p className="text-forest-600 text-lg">加载中...</p>
      </div>
    </div>
  );
}