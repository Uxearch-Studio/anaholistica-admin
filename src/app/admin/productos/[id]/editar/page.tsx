'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getProduct, updateProduct } from '@/lib/products';
import ProductForm from '@/components/admin/ProductForm';
import type { Product, ProductFormData } from '@/types/product';

export default function EditarProductoPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProduct(id)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(data: ProductFormData) {
    await updateProduct(id, data);
    router.push('/admin/productos');
  }

  if (loading) {
    return (
      <div className="max-w-lg mx-auto space-y-4">
        <div className="h-6 w-20 bg-cream rounded animate-pulse" />
        <div className="h-8 w-48 bg-cream rounded-lg animate-pulse" />
        <div className="h-52 bg-cream rounded-2xl animate-pulse" />
        <div className="h-12 bg-cream rounded-xl animate-pulse" />
        <div className="h-12 bg-cream rounded-xl animate-pulse" />
        <div className="h-28 bg-cream rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <p className="text-gray-500">Producto no encontrado.</p>
        <button onClick={() => router.push('/admin/productos')} className="mt-4 text-green text-sm font-medium">
          Volver a productos
        </button>
      </div>
    );
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

      <h1 className="text-xl font-bold text-black mb-6">Editar producto</h1>

      <ProductForm initial={product} submitLabel="Guardar cambios" onSubmit={handleSubmit} />
    </div>
  );
}
