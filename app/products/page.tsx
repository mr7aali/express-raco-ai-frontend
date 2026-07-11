'use client';

import { useState } from 'react';
import useSWR from 'swr';
import api from '@/lib/api';
import { Navbar } from '@/components/navbar';
import { ProductCard } from '@/components/product-card';
import { useCartStore, useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: string;
  stock: number;
  status: string;
  description?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

async function fetcher(url: string) {
  const res = await api.get(url);
  return res.data;
}

export default function ProductsPage() {
  const { user } = useAuthStore();
  const addItem = useCartStore((state) => state.addItem);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (categoryId) params.append('categoryId', categoryId);
  if (user?.role === 'CUSTOMER') {
    params.append('status', 'ACTIVE');
  }
  params.append('page', page.toString());
  params.append('limit', limit.toString());

  const { data: productsData, isLoading, error } = useSWR(
    `/api/products?${params.toString()}`,
    fetcher
  );

  const { data: categoriesData } = useSWR('/api/categories', fetcher);

  const handleAddToCart = (productId: string) => {
    addItem(productId, 1);
    alert('Product added to cart!');
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
            Products
          </h1>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <input
              type="text"
              placeholder="Search products by name or SKU..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categoriesData?.map((category: Category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {page > 1 && (
              <Button
                variant="outline"
                onClick={() => setPage(1)}
                className="col-start-3"
              >
                Reset Filters
              </Button>
            )}
          </div>

          {/* Error State */}
          {error && (
            <div className="mb-8 p-4 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle size={20} />
              <span>Failed to load products. Please make sure the API server is running.</span>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin">
                <div className="w-12 h-12 border-4 border-slate-300 dark:border-slate-700 border-t-blue-500 rounded-full mx-auto"></div>
              </div>
              <p className="mt-4 text-slate-600 dark:text-slate-400">Loading products...</p>
            </div>
          )}

          {/* Products Grid */}
          {productsData && productsData.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {productsData.map((product: Product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={user ? handleAddToCart : undefined}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <span className="px-4 py-2 text-slate-700 dark:text-slate-300">
                  Page {page}
                </span>
                {productsData.length === limit && (
                  <Button
                    variant="outline"
                    onClick={() => setPage(page + 1)}
                  >
                    Next
                  </Button>
                )}
              </div>
            </>
          ) : (
            !isLoading && (
              <div className="text-center py-12">
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                  No products found
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
}
