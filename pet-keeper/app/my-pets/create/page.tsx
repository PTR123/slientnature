import CreatePetClient from './page-client';
import { Suspense } from 'react';

export default function CreatePetPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-forest-600">加载中...</div>
      </div>
    }>
      <CreatePetClient />
    </Suspense>
  );
}