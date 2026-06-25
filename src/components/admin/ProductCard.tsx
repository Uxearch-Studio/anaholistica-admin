import Image from 'next/image';
import type { Product, ProductStatus } from '@/types/product';
import StatusBadge from '@/components/ui/StatusBadge';
import ActionMenu from '@/components/admin/ActionMenu';

interface Props {
  product: Product;
  onEdit: () => void;
  onStatusChange: (status: ProductStatus) => void;
  onDelete: () => void;
}

export default function ProductCard({ product, onEdit, onStatusChange, onDelete }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-cream p-4 flex gap-4 shadow-sm">
      {/* imagen */}
      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-cream flex-shrink-0">
        {product.imageUrl ? (
          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-cream">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
      </div>

      {/* info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-black text-sm leading-tight truncate">{product.name}</h3>
          <ActionMenu product={product} onEdit={onEdit} onStatusChange={onStatusChange} onDelete={onDelete} />
        </div>
        <p className="text-green font-bold text-base mt-0.5">$ {product.price.toLocaleString('es-CO')}</p>
        <p className="text-gray-500 text-xs mt-1 line-clamp-2">{product.description}</p>
        <div className="flex items-center gap-3 mt-2">
          <StatusBadge status={product.status} />
          <span className="text-xs text-gray-400">{product.unitsSold} vendidos</span>
        </div>
      </div>
    </div>
  );
}
