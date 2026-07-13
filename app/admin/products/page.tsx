'use client';

import { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import api, { unwrapApiArray } from '@/lib/api';
import { Navbar } from '@/components/navbar';
import { ProtectedRoute } from '@/components/protected-route';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, AlertCircle } from 'lucide-react';

async function fetcher(url: string) {
  const res = await api.get(url);
  return res.data;
}

function AdminProductsContent() {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const { data: products, isLoading, mutate } = useSWR(
    '/api/products?limit=100',
    fetcher
  );
  const productList = unwrapApiArray<any>(products);

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      setDeletingId(productId);
      await api.delete(`/api/products/${productId}`);
      mutate();
      alert('Product deleted successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin">
              <div className="w-12 h-12 border-4 border-slate-300 dark:border-slate-700 border-t-blue-500 rounded-full mx-auto"></div>
            </div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">Loading products...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
              Products
            </h1>
            <Link href="/admin/products/new">
              <Button>Add Product</Button>
            </Link>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {productList.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-lg p-12 text-center">
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">
                No products yet
              </p>
              <Link href="/admin/products/new">
                <Button>Create First Product</Button>
              </Link>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                        SKU
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {productList.map((product: any) => (
                      <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                        <td className="px-6 py-4">
                          <span className="text-slate-900 dark:text-white font-medium">
                            {product.name}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm text-slate-600 dark:text-slate-400">
                            {product.sku}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-slate-900 dark:text-white font-semibold">
                            ${parseFloat(product.price).toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-slate-600 dark:text-slate-400">
                            {product.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={product.status} type="product" />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Link href={`/admin/products/${product.id}`}>
                              <Button variant="outline" size="sm" className="gap-2">
                                <Edit size={16} />
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(product.id)}
                              disabled={deletingId === product.id}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function AdminProductsPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <AdminProductsContent />
    </ProtectedRoute>
  );
}
