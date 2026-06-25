export type ProductStatus = 'active' | 'archived' | 'unavailable' | 'low_stock';
export type ProductCategory = 'Mundo Mente' | 'Mundo Cuerpo' | 'Mundo Energía' | 'Mundo Naturaleza' | 'Mundo Alma';

export const CATEGORIES: ProductCategory[] = [
  'Mundo Mente',
  'Mundo Cuerpo',
  'Mundo Energía',
  'Mundo Naturaleza',
  'Mundo Alma',
];

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category?: ProductCategory;
  unitsSold: number;
  status: ProductStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFormData {
  name: string;
  price: string;
  description: string;
  imageFile?: File;
  imageUrl?: string;
  status: ProductStatus;
  category?: ProductCategory;
}

export const STATUS_LABELS: Record<ProductStatus, string> = {
  active: 'Activo',
  archived: 'Archivado',
  unavailable: 'No disponible',
  low_stock: 'Poco stock',
};
