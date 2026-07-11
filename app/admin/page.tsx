'use client';

import Link from 'next/link';
import useSWR from 'swr';
import api, { unwrapApiArray } from '@/lib/api';
import { Navbar } from '@/components/navbar';
import { ProtectedRoute } from '@/components/protected-route';
import { Button } from '@/components/ui/button';
import { Package, Tags, ShoppingBag, CreditCard } from 'lucide-react';

async function fetcher(url: string) {
  const res = await api.get(url);
  return res.data;
}

function AdminDashboardContent() {
  const { data: products } = useSWR('/api/products?limit=1', fetcher);
  const { data: categories } = useSWR('/api/categories', fetcher);
  const { data: orders } = useSWR('/api/orders', fetcher);
  const productList = unwrapApiArray<any>(products);
  const categoryList = unwrapApiArray<any>(categories);
  const orderList = unwrapApiArray<any>(orders);

  const stats = [
    {
      label: 'Total Products',
      value: productList.length,
      icon: Package,
      color: 'bg-blue-100 dark:bg-blue-950 text-blue-600',
      href: '/admin/products',
    },
    {
      label: 'Total Categories',
      value: categoryList.length,
      icon: Tags,
      color: 'bg-green-100 dark:bg-green-950 text-green-600',
      href: '/admin/categories',
    },
    {
      label: 'Total Orders',
      value: orderList.length,
      icon: ShoppingBag,
      color: 'bg-purple-100 dark:bg-purple-950 text-purple-600',
      href: '/account/orders',
    },
    {
      label: 'Payments',
      value: orderList[0]?.payments?.length || 0,
      icon: CreditCard,
      color: 'bg-orange-100 dark:bg-orange-950 text-orange-600',
      href: '/account/payments',
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Manage your e-commerce store
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Link key={stat.label} href={stat.href}>
                  <div className="bg-white dark:bg-slate-900 rounded-lg p-6 hover:shadow-lg transition cursor-pointer">
                    <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
                      <Icon size={24} />
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-1">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Product Management
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Create, edit, and manage your product catalog
              </p>
              <div className="flex gap-2">
                <Link href="/admin/products" className="flex-1">
                  <Button className="w-full">View Products</Button>
                </Link>
                <Link href="/admin/products/new" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Add Product
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Category Management
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Organize products into categories
              </p>
              <div className="flex gap-2">
                <Link href="/admin/categories" className="flex-1">
                  <Button className="w-full">View Categories</Button>
                </Link>
                <Link href="/admin/categories/new" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Add Category
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
