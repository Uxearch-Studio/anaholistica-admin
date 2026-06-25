'use client';

import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, orderBy, serverTimestamp, Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import type { Product, ProductFormData, ProductStatus } from '@/types/product';

const COL = 'products';

function toProduct(id: string, d: Record<string, unknown>): Product {
  return {
    id,
    name: d.name as string,
    price: d.price as number,
    description: d.description as string,
    imageUrl: (d.imageUrl as string) ?? '',
    unitsSold: (d.unitsSold as number) ?? 0,
    status: (d.status as ProductStatus) ?? 'active',
    createdAt: (d.createdAt as Timestamp)?.toDate() ?? new Date(),
    updatedAt: (d.updatedAt as Timestamp)?.toDate() ?? new Date(),
  };
}

export async function getProducts(): Promise<Product[]> {
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => toProduct(d.id, d.data() as Record<string, unknown>));
}

export async function getProduct(id: string): Promise<Product | null> {
  const snap = await getDoc(doc(db, COL, id));
  if (!snap.exists()) return null;
  return toProduct(snap.id, snap.data() as Record<string, unknown>);
}

async function uploadImage(file: File): Promise<string> {
  const r = ref(storage, `products/${Date.now()}_${file.name}`);
  await uploadBytes(r, file);
  return getDownloadURL(r);
}

export async function createProduct(data: ProductFormData): Promise<string> {
  let imageUrl = data.imageUrl ?? '';
  if (data.imageFile) imageUrl = await uploadImage(data.imageFile);

  const ref2 = await addDoc(collection(db, COL), {
    name: data.name,
    price: parseFloat(data.price),
    description: data.description,
    imageUrl,
    unitsSold: 0,
    status: data.status,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref2.id;
}

export async function updateProduct(id: string, data: Partial<ProductFormData>): Promise<void> {
  const update: Record<string, unknown> = { updatedAt: serverTimestamp() };

  if (data.name !== undefined) update.name = data.name;
  if (data.description !== undefined) update.description = data.description;
  if (data.price !== undefined) update.price = parseFloat(data.price);
  if (data.status !== undefined) update.status = data.status;
  if (data.imageFile) update.imageUrl = await uploadImage(data.imageFile);
  else if (data.imageUrl !== undefined) update.imageUrl = data.imageUrl;

  await updateDoc(doc(db, COL, id), update);
}

export async function updateProductStatus(id: string, status: ProductStatus): Promise<void> {
  await updateDoc(doc(db, COL, id), { status, updatedAt: serverTimestamp() });
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}
