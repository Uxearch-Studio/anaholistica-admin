'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Package, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { getProducts, updateProductStatus, deleteProduct } from '@/lib/products';
import type { Product, ProductStatus } from '@/types/product';
import StatusBadge from '@/components/ui/StatusBadge';
import ActionMenu from '@/components/admin/ActionMenu';
import ProductCard from '@/components/admin/ProductCard';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function ProductosPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toDelete, setToDelete] = useState<Product | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
      setError('No se pudo conectar con la base de datos. Verifica las credenciales de Firebase en Vercel.');
    }, 8000);

    getProducts()
      .then(setProducts)
      .catch(() => setError('Error al cargar productos. Verifica la configuración de Firebase.'))
      .finally(() => { clearTimeout(timeout); setLoading(false); });

    return () => clearTimeout(timeout);
  }, []);

  async function handleStatusChange(id: string, status: ProductStatus) {
    await updateProductStatus(id, status);
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  }

  async function handleDelete(product: Product) {
    setToDelete(product);
  }

  async function confirmDelete() {
    if (!toDelete) return;
    await deleteProduct(toDelete.id);
    setProducts(prev => prev.filter(p => p.id !== toDelete.id));
    setToDelete(null);
  }

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="h-8 w-40 bg-cream rounded-lg animate-pulse" />
        {[1, 2, 3].map(i => (
          <div key={i} className="h-28 bg-cream rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <Package size={28} className="text-red-400" />
        </div>
        <p className="font-semibold text-black mb-1">Sin conexión a Firebase</p>
        <p className="text-sm text-gray-500 max-w-sm">{error}</p>
      </div>
    );
  }

  return (
    <>
      {/* encabezado */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-black">Mis Productos</h1>
          <p className="text-sm text-gray-400 mt-0.5">{products.length} producto{products.length !== 1 ? 's' : ''}</p>
        </div>
        <Link
          href="/admin/productos/crear"
          className="flex items-center gap-2 bg-green text-white text-sm font-medium px-4 py-2.5 rounded-xl"
        >
          <PlusCircle size={17} />
          <span className="hidden sm:inline">Crear producto</span>
          <span className="sm:hidden">Crear</span>
        </Link>
      </div>

      {/* vacío */}
      {products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package size={48} className="text-cream mb-4" />
          <p className="text-gray-500 font-medium">Aún no tienes productos</p>
          <p className="text-sm text-gray-400 mt-1 mb-6">Crea tu primer producto para comenzar</p>
          <Link
            href="/admin/productos/crear"
            className="bg-green text-white text-sm font-medium px-6 py-3 rounded-xl"
          >
            Crear primer producto
          </Link>
        </div>
      )}

      {/* Mobile: cards */}
      {products.length > 0 && (
        <>
          <div className="sm:hidden space-y-3">
            {products.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onEdit={() => router.push(`/admin/productos/${p.id}/editar`)}
                onStatusChange={s => handleStatusChange(p.id, s)}
                onDelete={() => handleDelete(p)}
              />
            ))}
          </div>

          {/* Desktop: tabla */}
          <div className="hidden sm:block bg-white rounded-2xl border border-cream overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cream bg-surface">
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Imagen</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Nombre</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Precio</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500 max-w-[200px]">Descripción</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Vendidos</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Estado</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-surface/60 transition-colors">
                    <td className="px-4 py-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-cream flex-shrink-0">
                        {p.imageUrl ? (
                          <Image src={p.imageUrl} alt={p.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={20} className="text-gray-300" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-black max-w-[140px] truncate">{p.name}</td>
                    <td className="px-4 py-3 text-green font-semibold">$ {p.price.toLocaleString('es-CO')}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-[200px]">
                      <p className="truncate">{p.description}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.unitsSold}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-4 py-3">
                      <ActionMenu
                        product={p}
                        onEdit={() => router.push(`/admin/productos/${p.id}/editar`)}
                        onStatusChange={s => handleStatusChange(p.id, s)}
                        onDelete={() => handleDelete(p)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Eliminar producto"
        message={`¿Seguro que quieres eliminar "${toDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </>
  );
}
