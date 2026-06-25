'use client';

import { useState, useRef, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import { Camera, X } from 'lucide-react';
import type { Product, ProductFormData } from '@/types/product';
import { CATEGORIES } from '@/types/product';

interface Props {
  initial?: Product;
  onSubmit: (data: ProductFormData) => Promise<void>;
  submitLabel: string;
}

export default function ProductForm({ initial, onSubmit, submitLabel }: Props) {
  const [form, setForm] = useState<ProductFormData>({
    name: initial?.name ?? '',
    price: initial?.price?.toString() ?? '',
    description: initial?.description ?? '',
    imageUrl: initial?.imageUrl ?? '',
    status: initial?.status ?? 'active',
    category: initial?.category ?? undefined,
  });
  const [preview, setPreview] = useState<string>(initial?.imageUrl ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  function handleImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm(f => ({ ...f, imageFile: file }));
    setPreview(URL.createObjectURL(file));
  }

  function clearImage() {
    setForm(f => ({ ...f, imageFile: undefined, imageUrl: '' }));
    setPreview('');
    if (fileRef.current) fileRef.current.value = '';
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return setError('El nombre es requerido.');
    if (!form.price || isNaN(parseFloat(form.price))) return setError('Ingresa un precio válido.');
    setError('');
    setLoading(true);
    try {
      await onSubmit(form);
    } catch {
      setError('Ocurrió un error. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  const input = 'w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green bg-white';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* imagen */}
      <div>
        <label className="block text-sm font-medium text-black mb-2">Imagen del producto</label>
        {preview ? (
          <div className="relative w-full h-52 rounded-2xl overflow-hidden bg-cream">
            <Image src={preview} alt="preview" fill className="object-cover" />
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-full h-40 rounded-2xl border-2 border-dashed border-cream bg-white flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-green hover:text-green transition-colors"
          >
            <Camera size={32} />
            <span className="text-sm">Toca para subir imagen</span>
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
      </div>

      {/* nombre */}
      <div>
        <label className="block text-sm font-medium text-black mb-2">Nombre</label>
        <input
          className={input}
          placeholder="Ej. Aceite esencial de lavanda"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        />
      </div>

      {/* precio */}
      <div>
        <label className="block text-sm font-medium text-black mb-2">Precio</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
          <input
            className={`${input} pl-8`}
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={form.price}
            onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
          />
        </div>
      </div>

      {/* descripcion */}
      <div>
        <label className="block text-sm font-medium text-black mb-2">Descripción</label>
        <textarea
          className={`${input} resize-none h-28`}
          placeholder="Describe el producto..."
          value={form.description}
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
        />
      </div>

      {/* categoría */}
      <div>
        <label className="block text-sm font-medium text-black mb-2">Categoría</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setForm(f => ({ ...f, category: f.category === cat ? undefined : cat }))}
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition-colors ${
                form.category === cat
                  ? 'bg-green text-white border-green'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-green/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* estado — solo en edición */}
      {initial && (
        <div>
          <label className="block text-sm font-medium text-black mb-2">Estado</label>
          <select
            className={input}
            value={form.status}
            onChange={e => setForm(f => ({ ...f, status: e.target.value as ProductFormData['status'] }))}
          >
            <option value="active">Activo</option>
            <option value="low_stock">Poco stock</option>
            <option value="unavailable">No disponible</option>
            <option value="archived">Archivado</option>
          </select>
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-2xl bg-green text-white font-semibold text-base disabled:opacity-60 transition-opacity"
      >
        {loading ? 'Guardando...' : submitLabel}
      </button>
    </form>
  );
}
