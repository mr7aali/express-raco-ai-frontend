'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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

function CheckoutContent() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;
  const [provider, setProvider] = useState<'STRIPE' | 'BKASH'>('STRIPE');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentInitiated, setPaymentInitiated] = useState(false);

  const { data: order, isLoading, error: orderError } = useSWR(
    `/api/orders/${orderId}`,
    fetcher
  );

  const handleInitiatePayment = async () => {
    try {
      setError('');
      setLoading(true);

      const response = await api.post('/api/payments/checkout', {
        orderId,
        provider,
      });

      if (provider === 'STRIPE') {
        // For Stripe, redirect to Stripe Checkout
        if (response.data.clientSecret) {
          // Redirect to payment confirmation page with clientSecret
          router.push(`/payment-confirm?clientSecret=${response.data.clientSecret}&orderId=${orderId}`);
        }
      } else if (provider === 'BKASH') {
        // For bKash, redirect to their URL
        if (response.data.redirectUrl) {
          window.location.href = response.data.redirectUrl;
        }
      }

      setPaymentInitiated(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to initiate payment');
    } finally {
      setLoading(false);
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
            <p className="mt-4 text-slate-600 dark:text-slate-400">Loading order...</p>
          </div>
        </div>
      </>
    );
  }

  if (orderError || !order) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
          <div className="container mx-auto px-4">
            <div className="p-4 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle size={20} />
              <span>Failed to load order details.</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  const totalAmount = parseFloat(order.totalAmount);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
            Checkout
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <div className="grid gap-6">
            {/* Order Summary */}
            <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-slate-700 dark:text-slate-300">
                  <span>Order ID</span>
                  <span className="font-mono text-sm">{orderId}</span>
                </div>
                <div className="flex justify-between text-slate-700 dark:text-slate-300">
                  <span>Status</span>
                  <div>
                    <StatusBadge status={order.status} type="order" />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
                  Items
                </h3>
                <div className="space-y-2 mb-4">
                  {order.items?.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-slate-700 dark:text-slate-300"
                    >
                      <span>
                        {item.productId} x {item.quantity}
                      </span>
                      <span>${parseFloat(item.subtotal).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    Total Amount
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            {order.status === 'PENDING' && (
              <div className="bg-white dark:bg-slate-900 rounded-lg p-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                  Payment Method
                </h2>

                <div className="space-y-3 mb-6">
                  <label className="flex items-center gap-3 p-4 border-2 border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                    style={{ borderColor: provider === 'STRIPE' ? '#3b82f6' : undefined }}>
                    <input
                      type="radio"
                      name="provider"
                      value="STRIPE"
                      checked={provider === 'STRIPE'}
                      onChange={(e) => setProvider(e.target.value as 'STRIPE' | 'BKASH')}
                      className="w-4 h-4"
                    />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        Stripe
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Credit/Debit Card
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-4 border-2 border-slate-200 dark:border-slate-800 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                    style={{ borderColor: provider === 'BKASH' ? '#ec407a' : undefined }}>
                    <input
                      type="radio"
                      name="provider"
                      value="BKASH"
                      checked={provider === 'BKASH'}
                      onChange={(e) => setProvider(e.target.value as 'STRIPE' | 'BKASH')}
                      className="w-4 h-4"
                    />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white">
                        bKash
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Mobile Money
                      </div>
                    </div>
                  </label>
                </div>

                <Button
                  onClick={handleInitiatePayment}
                  disabled={loading || paymentInitiated}
                  className="w-full py-3 text-lg"
                >
                  {loading ? 'Processing...' : `Pay ${provider} - $${totalAmount.toFixed(2)}`}
                </Button>
              </div>
            )}

            {/* Payment Already Made */}
            {order.status !== 'PENDING' && (
              <div className="bg-white dark:bg-slate-900 rounded-lg p-6 text-center">
                <div className="mb-4">
                  {order.status === 'PAID' && (
                    <div className="text-green-600 text-lg font-semibold">
                      ✓ Payment Successful!
                    </div>
                  )}
                  {order.status === 'CANCELED' && (
                    <div className="text-red-600 text-lg font-semibold">
                      × Order Cancelled
                    </div>
                  )}
                </div>
                <Button onClick={() => router.push('/account/orders')}>
                  View Orders
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <CheckoutContent />
    </ProtectedRoute>
  );
}
