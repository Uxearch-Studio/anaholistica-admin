import type { ProductStatus } from '@/types/product';
import { STATUS_LABELS } from '@/types/product';

const styles: Record<ProductStatus, string> = {
  active: 'bg-green/10 text-green border border-green/20',
  archived: 'bg-gray-100 text-gray-500 border border-gray-200',
  unavailable: 'bg-red-50 text-red-600 border border-red-200',
  low_stock: 'bg-gold-light text-yellow-700 border border-gold/40',
};

export default function StatusBadge({ status }: { status: ProductStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${styles[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
