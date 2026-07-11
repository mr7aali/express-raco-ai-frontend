'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useSWR from 'swr';
import api, { unwrapApiArray, unwrapApiData } from '@/lib/api';
import { Navbar } from '@/components/navbar';
import { ProtectedRoute } from '@/components/protected-route';
import { useCartStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Trash2, Minus, Plus } from 'lucide-react';

async function fetcher(url: string) {
  const res = await api.get(url);
  return res.data;
}

function CartContent() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch product details for all items in cart
  const { data: products } = useSWR(
    items.length > 0 ? `/api/products?limit=100` : null,
    fetcher
  );
  const productList = unwrapApiArray<any>(products);

  const cartItems = items
    .map((item) => {
      const product = productList.find((p: any) => p.id === item.productId);
      return { ...item, product };
    })
    .filter((item) => item.product);

  const total = cartItems.reduce((sum, item) => {
    return sum + parseFloat(item.product.price) * item.quantity;
  }, 0);

  const handleCheckout = async () => {
    try {
      setError('');
      setLoading(true);

      // Create order
      const orderResponse = await api.post('/api/orders', {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      const order = unwrapApiData<any>(orderResponse.data);
      const orderId = order.id;
      clearCart();
      router.push(`/checkout/${orderId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
              Shopping Cart
            </h1>
            <div className="bg-white dark:bg-slate-900 rounded-lg p-12 text-center">
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">
                Your cart is empty
              </p>
              <Link href="/products">
                <Button>Continue Shopping</Button>
              </Link>
            </div>
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
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
            Shopping Cart
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-200 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className="bg-white dark:bg-slate-900 rounded-lg p-6 flex gap-4"
                >
                  <div className="flex-1">
                    <Link href={`/products/${item.product.id}`}>
                      <h3 className="font-semibold text-slate-900 dark:text-white hover:text-blue-600">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      SKU: {item.product.sku}
                    </p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-2">
                      ${parseFloat(item.product.price).toFixed(2)} each
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.productId)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <Trash2 size={18} />
                    </Button>

                    <div className="flex items-center gap-2 border border-slate-300 dark:border-slate-700 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                      ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-900 rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6 pb-6 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-slate-700 dark:text-slate-300">
                    <span>Tax</span>
                    <span>$0.00</span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-slate-900 dark:text-white">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full mb-3"
                >
                  {loading ? 'Processing...' : 'Proceed to Checkout'}
                </Button>

                <Link href="/products">
                  <Button variant="outline" className="w-full">
                    Continue Shopping
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

export default function CartPage() {
  return (
    <ProtectedRoute>
      <CartContent />
    </ProtectedRoute>
  );
}
