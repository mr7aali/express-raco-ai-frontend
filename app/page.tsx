'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Zap, Shield, Truck } from 'lucide-react';

export default function Home() {
  const { user } = useAuthStore();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
        {/* Hero Section */}
        <section className="py-20 md:py-32 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
              Welcome to ShopHub
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
              Your one-stop destination for quality products. Browse our extensive catalog, compare prices, and enjoy secure checkout with multiple payment options.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="gap-2">
                  <ShoppingBag size={20} />
                  Start Shopping
                </Button>
              </Link>
              {!user && (
                <Link href="/register">
                  <Button variant="outline" size="lg">
                    Create Account
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white text-center mb-12">
              Why Choose ShopHub?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Fast &amp; Reliable
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Quick checkout process with instant order confirmation
                </p>
              </div>

              {/* Feature 2 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Secure Payment
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Multiple payment options including Stripe and bKash
                </p>
              </div>

              {/* Feature 3 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-950 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Easy Management
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Track your orders and payments from one dashboard
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call-to-Action Section */}
        <section className="py-16 md:py-24 px-4">
          <div className="container mx-auto max-w-2xl">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 md:p-12 text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Shop?
              </h2>
              <p className="text-lg mb-8 opacity-90">
                Explore thousands of products and find exactly what you need.
              </p>
              <Link href="/products">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100">
                  Browse Products
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 dark:border-slate-800 py-8 px-4 bg-white dark:bg-slate-900">
          <div className="container mx-auto max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-4">
                  ShopHub
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Your trusted online shopping platform
                </p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-4">
                  Quick Links
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/products" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                      Products
                    </Link>
                  </li>
                  <li>
                    <Link href="/categories" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                      Categories
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white mb-4">
                  Account
                </h4>
                <ul className="space-y-2 text-sm">
                  {user ? (
                    <>
                      <li>
                        <Link href="/account/orders" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                          My Orders
                        </Link>
                      </li>
                      <li>
                        <Link href="/account/payments" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                          Payments
                        </Link>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link href="/login" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                          Login
                        </Link>
                      </li>
                      <li>
                        <Link href="/register" className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">
                          Sign Up
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-800 pt-8 text-center">
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                © 2024 ShopHub. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
