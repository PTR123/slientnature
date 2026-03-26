import EditPetClient from './page-client';

export default function EditPetPage({ params }: { params: { id: string } }) {
  return <EditPetClient petId={params.id} />;
}