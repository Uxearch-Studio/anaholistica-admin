'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { createProduct } from '@/lib/products';
import ProductForm from '@/components/admin/ProductForm';
import type { ProductFormData } from '@/types/product';

export default function CrearProductoPage() {
  const router = useRouter();

  async function handleSubmit(data: ProductFormData) {
    await createProduct(data);
    router.push('/admin/productos');
  }

  return (
    <div className="max-w-lg mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 text-sm mb-6 hover:text-green transition-colors"
      >
        <ArrowLeft size={17} />
        Volver
      </button>

      <h1 className="text-xl font-bold text-black mb-6">Crear producto</h1>

      <ProductForm submitLabel="Crear producto" onSubmit={handleSubmit} />
    </div>
  );
}
