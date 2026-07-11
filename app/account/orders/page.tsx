'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import api from '@/lib/api';
import { Navbar } from '@/components/navbar';
import { ProtectedRoute } from '@/components/protected-route';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

async function fetcher(url: string) {
  const res = await api.get(url);
  return res.data;
}

function OrdersContent() {
  const router = useRouter();
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const { data: orders, isLoading, mutate } = useSWR(
    '/api/orders',
    fetcher
  );

  const handleCancelOrder = async (orderId: string) => {
    try {
      setCancelingId(orderId);
      await api.patch(`/api/orders/${orderId}/cancel`);
      mutate();
      alert('Order cancelled successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelingId(null);
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
            <p className="mt-4 text-slate-600 dark:text-slate-400">Loading orders...</p>
          </div>
        </div>
      </>
    );
  }

  if (orders?.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
              My Orders
            </h1>
            <div className="bg-white dark:bg-slate-900 rounded-lg p-12 text-center">
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">
                You haven&apos;t placed any orders yet
              </p>
              <Button onClick={() => router.push('/products')}>
                Start Shopping
              </Button>
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
            My Orders
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            {orders?.map((order: any) => (
              <div
                key={order.id}
                className="bg-white dark:bg-slate-900 rounded-lg p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Order ID
                    </p>
                    <p className="font-mono text-lg text-slate-900 dark:text-white">
                      {order.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Status
                    </p>
                    <StatusBadge status={order.status} type="order" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Total Amount
                    </p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      ${parseFloat(order.totalAmount).toFixed(2)}
                    </p>
                  </div>
                </div>

                {order.items && (
                  <div className="mb-4 pb-4 border-t border-slate-200 dark:border-slate-800">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                      Items ({order.items.length})
                    </p>
                    <div className="space-y-1">
                      {order.items.map((item: any, idx: number) => (
                        <p
                          key={idx}
                          className="text-sm text-slate-600 dark:text-slate-400"
                        >
                          {item.productId} x {item.quantity} = ${parseFloat(item.subtotal).toFixed(2)}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/account/orders/${order.id}`)}
                  >
                    View Details
                  </Button>
                  {order.status === 'PENDING' && (
                    <>
                      <Button
                        onClick={() => router.push(`/checkout/${order.id}`)}
                      >
                        Continue Payment
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={cancelingId === order.id}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        {cancelingId === order.id ? 'Cancelling...' : 'Cancel Order'}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersContent />
    </ProtectedRoute>
  );
}
