'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, PlusCircle } from 'lucide-react';

const nav = [
  { href: '/admin/productos', label: 'Mis Productos', icon: LayoutGrid },
  { href: '/admin/productos/crear', label: 'Crear producto', icon: PlusCircle },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      {/* Header */}
      <header className="bg-green sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-gold font-bold text-lg tracking-tight">Ana</span>
            <span className="text-white font-light text-lg tracking-tight">Holística</span>
            <span className="ml-2 text-white/40 text-xs font-medium uppercase tracking-widest hidden sm:block">Admin</span>
          </div>
          {/* Desktop nav */}
          <nav className="hidden sm:flex items-center gap-1">
            {nav.map(item => {
              const active = pathname === item.href || (item.href !== '/admin/productos/crear' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active ? 'bg-white/15 text-white' : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <item.icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 pb-24 sm:pb-6">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-cream z-20">
        <div className="flex">
          {nav.map(item => {
            const active = pathname === item.href || (item.href !== '/admin/productos/crear' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                  active ? 'text-green' : 'text-gray-400'
                }`}
              >
                <item.icon size={22} strokeWidth={active ? 2.5 : 1.8} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
