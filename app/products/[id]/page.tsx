'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import useSWR from 'swr';
import api, { unwrapApiArray, unwrapApiData } from '@/lib/api';
import { Navbar } from '@/components/navbar';
import { ProductCard } from '@/components/product-card';
import { StatusBadge } from '@/components/status-badge';
import { useCartStore, useAuthStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { AlertCircle, Minus, Plus } from 'lucide-react';

async function fetcher(url: string) {
  const res = await api.get(url);
  return res.data;
}

export default function ProductDetailsPage() {
  const params = useParams();
  const productId = params.id as string;
  const { user } = useAuthStore();
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);

  const { data: productData, isLoading, error } = useSWR(
    `/api/products/${productId}`,
    fetcher
  );

  const { data: recommendations } = useSWR(
    `/api/products/${productId}/recommendations`,
    fetcher
  );
  const product = unwrapApiData<any>(productData);
  const recommendationList = unwrapApiArray<any>(recommendations);

  const handleAddToCart = () => {
    addItem(productId, quantity);
    setQuantity(1);
    alert('Product added to cart!');
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
            <p className="mt-4 text-slate-600 dark:text-slate-400">Loading product...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
          <div className="container mx-auto px-4">
            <div className="p-4 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle size={20} />
              <span>Failed to load product details.</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  const price = parseFloat(product.price);
  const inStock = product.stock > 0;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
        <div className="container mx-auto px-4">
          {/* Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Product Image Placeholder */}
            <div className="bg-white dark:bg-slate-900 rounded-lg p-8 flex items-center justify-center min-h-96">
              <div className="text-center">
                <div className="w-48 h-48 bg-slate-200 dark:bg-slate-800 rounded-lg mx-auto flex items-center justify-center mb-4">
                  <span className="text-slate-500 dark:text-slate-400">Product Image</span>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="bg-white dark:bg-slate-900 rounded-lg p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                    {product.name}
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400">SKU: {product.sku}</p>
                </div>
                <StatusBadge status={product.status} type="product" />
              </div>

              {product.description && (
                <p className="text-slate-700 dark:text-slate-300 mb-6">
                  {product.description}
                </p>
              )}

              <div className="mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-end gap-4 mb-4">
                  <span className="text-4xl font-bold text-slate-900 dark:text-white">
                    ${price.toFixed(2)}
                  </span>
                  <span className={`text-lg font-medium ${inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {inStock ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
              </div>

              {/* Quantity Selector */}
              {user && inStock && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Minus size={20} />
                    </button>
                    <span className="text-xl font-semibold w-12 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="p-2 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              )}

              {/* Add to Cart Button */}
              {user ? (
                <Button
                  onClick={handleAddToCart}
                  disabled={!inStock}
                  className="w-full py-3 text-lg"
                >
                  {inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
              ) : (
                <Button disabled className="w-full py-3 text-lg">
                  Sign in to purchase
                </Button>
              )}
            </div>
          </div>

          {/* Recommendations */}
          {recommendationList.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                Related Products
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {recommendationList.map((rec: any) => (
                  <ProductCard
                    key={rec.id}
                    product={rec}
                    onAddToCart={user ? () => addItem(rec.id, 1) : undefined}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
