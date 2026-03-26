import SpeciesDetailClient from './page-client';
import { speciesData } from '@/lib/data';
import { notFound } from 'next/navigation';

interface SpeciesDetailPageProps {
  params: {
    id: string;
  };
}

export default function SpeciesDetailPage({ params }: SpeciesDetailPageProps) {
  const species = speciesData.find((s) => s.id === params.id);

  if (!species) {
    notFound();
  }

  return <SpeciesDetailClient species={species} />;
}