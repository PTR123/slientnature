// Types
export interface Species {
  id: string;
  name: string;
  scientificName: string;
  category: 'insect' | 'reptile' | 'aquatic' | 'bird' | 'exotic';
  subcategory: string;
  image: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  temperature: { min: number; max: number };
  humidity: { min: number; max: number };
  lifespan: string;
  origin: string;
  diet: string[];
  feedingFrequency: string;
  enclosure: {
    substrate: string[];
    decor: string[];
    size: string;
  };
  lifecycle: string[];
  diseases: {
    name: string;
    symptoms: string[];
    treatment: string;
    vetRequired: boolean;
  }[];
}

export interface Pet {
  id: string;
  name: string;
  speciesId: string;
  species: Species;
  image: string;
  birthDate: string;
  acquisitionDate: string;
  records: PetRecord[];
}

export interface PetRecord {
  id: string;
  petId: string;
  date: string;
  type: 'molt' | 'feeding' | 'weighing' | 'water_change' | 'treatment' | 'breeding' | 'other';
  notes: string;
  image?: string;
  weight?: number;
  length?: number;
}

export interface CommunityPost {
  id: string;
  author: string;
  authorAvatar: string;
  title: string;
  content: string;
  image: string;
  likes: number;
  comments: number;
  createdAt: string;
  tags: string[];
}