import PetDetailClient from './page-client';

export default function PetDetailPage({ params }: { params: { id: string } }) {
  return <PetDetailClient petId={params.id} />;
}