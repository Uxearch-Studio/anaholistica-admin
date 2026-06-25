'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Package, PlusCircle, WifiOff } from 'lucide-react';
import Link from 'next/link';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { updateProductStatus, deleteProduct } from '@/lib/products';
import type { Product, ProductStatus } from '@/types/product';
import StatusBadge from '@/components/ui/StatusBadge';
import ActionMenu from '@/components/admin/ActionMenu';
import ProductCard from '@/components/admin/ProductCard';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

const configured = !!(
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY
);

function toProduct(id: string, d: Record<string, unknown>): Product {
  return {
    id,
    name: d.name as string,
    price: d.price as number,
    description: d.description as string,
    imageUrl: (d.imageUrl as string) ?? '',
    category: d.category as Product['category'],
    unitsSold: (d.unitsSold as number) ?? 0,
    status: (d.status as ProductStatus) ?? 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export default function ProductosPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(configured);
  const [toDelete, setToDelete] = useState<Product | null>(null);

  useEffect(() => {
    if (!configured) return;

    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      snap => {
        setProducts(snap.docs.map(d => toProduct(d.id, d.data() as Record<string, unknown>)));
        setLoading(false);
      },
      () => setLoading(false)
    );
    return () => unsub();
  }, []);

  async function handleStatusChange(id: string, status: ProductStatus) {
    await updateProductStatus(id, status);
  }

  async function confirmDelete() {
    if (!toDelete) return;
    await deleteProduct(toDelete.id);
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

  return (
    <>
      {/* header */}
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

      {/* aviso Firebase no conectado */}
      {!configured && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-5">
          <WifiOff size={18} className="text-amber-500 flex-shrink-0" />
          <p className="text-sm text-amber-700">
            Firebase no está configurado. Conecta las credenciales en Vercel para guardar productos.
          </p>
        </div>
      )}

      {/* empty state */}
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

      {/* mobile: cards */}
      {products.length > 0 && (
        <>
          <div className="sm:hidden space-y-3">
            {products.map(p => (
              <ProductCard
                key={p.id}
                product={p}
                onEdit={() => router.push(`/admin/productos/${p.id}/editar`)}
                onStatusChange={s => handleStatusChange(p.id, s)}
                onDelete={() => setToDelete(p)}
              />
            ))}
          </div>

          {/* desktop: tabla */}
          <div className="hidden sm:block bg-white rounded-2xl border border-cream overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cream bg-surface">
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Imagen</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Nombre</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Precio</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Descripción</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Categoría</th>
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
                    <td className="px-4 py-3 text-green font-semibold whitespace-nowrap">$ {p.price.toLocaleString('es-CO')}</td>
                    <td className="px-4 py-3 text-gray-500 max-w-[180px]">
                      <p className="truncate">{p.description}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{p.category ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{p.unitsSold}</td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-4 py-3">
                      <ActionMenu
                        product={p}
                        onEdit={() => router.push(`/admin/productos/${p.id}/editar`)}
                        onStatusChange={s => handleStatusChange(p.id, s)}
                        onDelete={() => setToDelete(p)}
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
