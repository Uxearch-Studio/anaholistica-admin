'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Pencil, Archive, EyeOff, AlertTriangle, Trash2, CheckCircle } from 'lucide-react';
import type { Product, ProductStatus } from '@/types/product';

interface Props {
  product: Product;
  onEdit: () => void;
  onStatusChange: (status: ProductStatus) => void;
  onDelete: () => void;
}

export default function ActionMenu({ product, onEdit, onStatusChange, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const actions = [
    {
      label: 'Editar',
      icon: Pencil,
      className: 'text-gray-700',
      onClick: () => { onEdit(); setOpen(false); },
    },
    {
      label: 'Marcar activo',
      icon: CheckCircle,
      className: 'text-green',
      hidden: product.status === 'active',
      onClick: () => { onStatusChange('active'); setOpen(false); },
    },
    {
      label: 'Archivar',
      icon: Archive,
      className: 'text-gray-700',
      hidden: product.status === 'archived',
      onClick: () => { onStatusChange('archived'); setOpen(false); },
    },
    {
      label: 'No disponible',
      icon: EyeOff,
      className: 'text-orange-600',
      hidden: product.status === 'unavailable',
      onClick: () => { onStatusChange('unavailable'); setOpen(false); },
    },
    {
      label: 'Poco stock',
      icon: AlertTriangle,
      className: 'text-yellow-600',
      hidden: product.status === 'low_stock',
      onClick: () => { onStatusChange('low_stock'); setOpen(false); },
    },
    {
      label: 'Eliminar',
      icon: Trash2,
      className: 'text-red-600',
      onClick: () => { onDelete(); setOpen(false); },
    },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="p-2 rounded-lg hover:bg-cream transition-colors"
        aria-label="Acciones"
      >
        <MoreVertical size={18} className="text-gray-500" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-30">
          {actions
            .filter(a => !a.hidden)
            .map(a => (
              <button
                key={a.label}
                onClick={a.onClick}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-surface transition-colors ${a.className}`}
              >
                <a.icon size={16} />
                {a.label}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
