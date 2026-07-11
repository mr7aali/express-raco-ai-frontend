'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useSWR from 'swr';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createProductSchema, type CreateProductInput } from '@/lib/schemas';
import api, { unwrapApiArray } from '@/lib/api';
import { Navbar } from '@/components/navbar';
import { ProtectedRoute } from '@/components/protected-route';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

async function fetcher(url: string) {
  const res = await api.get(url);
  return res.data;
}

function NewProductContent() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { data: categories, isLoading: loadingCategories } = useSWR(
    '/api/categories',
    fetcher
  );
  const categoryList = unwrapApiArray<any>(categories);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
  });

  const onSubmit = async (data: CreateProductInput) => {
    try {
      setError('');
      setSubmitting(true);

      await api.post('/api/products', {
        ...data,
        price: parseFloat(data.price.toString()),
        stock: parseInt(data.stock.toString()),
      });

      router.push('/admin/products');
      alert('Product created successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCategories) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin">
              <div className="w-12 h-12 border-4 border-slate-300 dark:border-slate-700 border-t-blue-500 rounded-full mx-auto"></div>
            </div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">Loading form...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <Link href="/admin/products" className="text-blue-600 hover:text-blue-700 mb-6 inline-flex items-center gap-1">
            ← Back to Products
          </Link>

          <div className="bg-white dark:bg-slate-900 rounded-lg p-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Create New Product
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Add a new product to your store
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    {...register('name')}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Premium Wireless Headphones"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    SKU *
                  </label>
                  <input
                    type="text"
                    {...register('sku')}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., WH-001"
                  />
                  {errors.sku && (
                    <p className="mt-1 text-sm text-red-600">{errors.sku.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Product description..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    {...register('price', { valueAsNumber: true })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="99.99"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Stock *
                  </label>
                  <input
                    type="number"
                    {...register('stock', { valueAsNumber: true })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                  {errors.stock && (
                    <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Status *
                  </label>
                  <select
                    {...register('status')}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                  {errors.status && (
                    <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Category *
                </label>
                <select
                  {...register('categoryId')}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {categoryList.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
                )}
              </div>

              <div className="flex gap-3 pt-6 border-t border-slate-200 dark:border-slate-800">
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Product'}
                </Button>
                <Link href="/admin/products" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default function NewProductPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <NewProductContent />
    </ProtectedRoute>
  );
}
