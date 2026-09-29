export type ClothingCategory = '上衣' | '下装' | '连衣裙' | '外套' | '鞋子' | '配饰';
export type Feedback = '喜欢' | '不喜欢' | '不舒服' | '难搭配';

export interface Clothing {
  id: string;
  userId: string;
  imageFileId?: string;
  imagePath?: string;
  processedImageFileId?: string;
  processedImagePath?: string;
  category: ClothingCategory;
  color: string;
  season: string[];
  style: string[];
  fit: string;
  warmth: number;
  formality: number;
  occasion: string[];
  keywords: string[];
  aiTags?: Record<string, unknown>;
  wornCount: number;
  lastWornAt?: string;
  feedbacks: Feedback[];
  createdAt: string;
  updatedAt: string;
}

export interface Outfit {
  id: string;
  userId: string;
  clothingIds: string[];
  lockedClothingIds: string[];
  source: 'manual' | 'ai';
  mood?: string;
  style?: string;
  occasion?: string;
  keywords?: string;
  score?: number;
  explanation?: string;
  createdAt: string;
}

export interface WearLog {
  id: string;
  userId: string;
  outfitId?: string;
  clothingIds: string[];
  feedback?: Feedback;
  note?: string;
  wornAt: string;
}

export interface OutfitRequest {
  clothingIds: string[];
  mood: string;
  style: string;
  occasion: string;
  keywords: string;
}
