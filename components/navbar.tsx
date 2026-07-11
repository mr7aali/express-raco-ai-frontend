'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { ShoppingCart, LogOut, LayoutDashboard } from 'lucide-react';

export function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-8">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-slate-900 dark:text-white">
            ShopHub
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-6 flex-1">
            <Link href="/products" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
              Products
            </Link>
            <Link href="/categories" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
              Categories
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {user.role === 'ADMIN' && (
                  <Link href="/admin">
                    <Button variant="outline" size="sm" className="gap-2">
                      <LayoutDashboard size={16} />
                      Admin
                    </Button>
                  </Link>
                )}
                
                <Link href="/cart">
                  <Button variant="outline" size="sm" className="gap-2">
                    <ShoppingCart size={16} />
                    Cart
                  </Button>
                </Link>

                <div className="flex items-center gap-2 pl-4 border-l border-slate-200 dark:border-slate-800">
                  <span className="text-sm text-slate-600 dark:text-slate-400">{user.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    <LogOut size={16} />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
