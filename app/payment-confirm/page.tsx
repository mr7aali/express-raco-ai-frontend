'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import type { StripeElementsOptions } from '@stripe/stripe-js';
import { useRouter } from 'next/navigation';
import api, { unwrapApiData } from '@/lib/api';
import { Navbar } from '@/components/navbar';
import { ProtectedRoute } from '@/components/protected-route';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle2, CreditCard, Loader2, XCircle } from 'lucide-react';

type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const hasStripePublishableKey = Boolean(
  stripePublishableKey && !stripePublishableKey.includes('your_stripe_publishable_key'),
);
const stripePromise = hasStripePublishableKey ? loadStripe(stripePublishableKey as string) : null;

function getStripePaymentIntentId(clientSecret: string) {
  const secretIndex = clientSecret.indexOf('_secret_');
  return secretIndex === -1 ? '' : clientSecret.slice(0, secretIndex);
}

async function confirmPaymentOnBackend(transactionId: string) {
  const response = await api.post('/api/payments/stripe/confirm', {
    transactionId,
  });

  return unwrapApiData<any>(response.data);
}

function StripePaymentForm({
  orderId,
  transactionId,
  onStatusChange,
  onError,
}: {
  orderId: string;
  transactionId: string;
  onStatusChange: (status: PaymentStatus) => void;
  onError: (message: string) => void;
}) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    try {
      onError('');
      setSubmitting(true);

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-confirm?orderId=${orderId}`,
        },
        redirect: 'if_required',
      });

      if (error) {
        onError(error.message || 'Stripe payment confirmation failed');
        return;
      }

      if (paymentIntent?.status !== 'succeeded') {
        onStatusChange('PENDING');
        onError('Stripe did not mark this payment as succeeded yet.');
        return;
      }

      const result = await confirmPaymentOnBackend(paymentIntent.id || transactionId);
      const status = result.payment?.status || 'PENDING';

      onStatusChange(status);

      if (status === 'SUCCESS') {
        router.refresh();
      }
    } catch (err: any) {
      onError(err.response?.data?.message || 'Failed to confirm payment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-4">
        <PaymentElement />
      </div>

      <Button type="submit" disabled={!stripe || !elements || submitting} className="w-full py-3 text-lg">
        {submitting ? 'Confirming Payment...' : 'Pay with Stripe'}
      </Button>
    </form>
  );
}

function PaymentConfirmContent() {
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState('');
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState<PaymentStatus | ''>('');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setClientSecret(
      searchParams.get('clientSecret') ||
        searchParams.get('payment_intent_client_secret') ||
        '',
    );
    setOrderId(searchParams.get('orderId') || '');
  }, []);

  const transactionId = useMemo(
    () => getStripePaymentIntentId(clientSecret),
    [clientSecret],
  );

  const elementsOptions = useMemo<StripeElementsOptions | undefined>(() => {
    if (!clientSecret) {
      return undefined;
    }

    return {
      clientSecret,
      appearance: {
        theme: 'stripe',
      },
    };
  }, [clientSecret]);

  const handleCheckPayment = async () => {
    if (!transactionId) {
      setError('Invalid Stripe payment client secret.');
      return;
    }

    try {
      setError('');
      setChecking(true);

      const result = await confirmPaymentOnBackend(transactionId);
      setStatus(result.payment?.status || 'PENDING');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to check Stripe payment');
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    if (transactionId) {
      handleCheckPayment();
    }
  }, [transactionId]);

  const isSuccess = status === 'SUCCESS';
  const isFailed = status === 'FAILED';
  const missingStripeKey = !stripePromise;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white dark:bg-slate-900 rounded-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                <CreditCard size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Stripe Payment
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Enter card details and complete your order
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-200 rounded-lg flex items-center gap-2">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            {missingStripeKey && (
              <div className="mb-6 p-4 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 rounded-lg flex items-center gap-2">
                <AlertCircle size={20} />
                <span>Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to the frontend .env file and restart Next.js.</span>
              </div>
            )}

            <div className="space-y-4 mb-8">
              <div className="flex justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-slate-600 dark:text-slate-400">Order ID</span>
                <span className="font-mono text-sm text-slate-900 dark:text-white text-right">
                  {orderId || 'Missing'}
                </span>
              </div>
              <div className="flex justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="text-slate-600 dark:text-slate-400">Transaction ID</span>
                <span className="font-mono text-sm text-slate-900 dark:text-white text-right">
                  {transactionId || 'Missing'}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-600 dark:text-slate-400">Status</span>
                {status ? (
                  <StatusBadge status={status} type="payment" />
                ) : (
                  <span className="text-slate-500">Not completed</span>
                )}
              </div>
            </div>

            {!isSuccess && clientSecret && elementsOptions && stripePromise && (
              <div className="mb-8">
                <Elements stripe={stripePromise} options={elementsOptions}>
                  <StripePaymentForm
                    orderId={orderId}
                    transactionId={transactionId}
                    onStatusChange={setStatus}
                    onError={setError}
                  />
                </Elements>
              </div>
            )}

            <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-6 mb-8">
              {checking && (
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <Loader2 className="animate-spin" size={22} />
                  <span>Checking Stripe payment status...</span>
                </div>
              )}

              {!checking && isSuccess && (
                <div className="flex items-center gap-3 text-green-700 dark:text-green-300">
                  <CheckCircle2 size={24} />
                  <span>Payment successful. Your order is now paid.</span>
                </div>
              )}

              {!checking && isFailed && (
                <div className="flex items-center gap-3 text-red-700 dark:text-red-300">
                  <XCircle size={24} />
                  <span>Payment failed. You can retry checkout for this order.</span>
                </div>
              )}

              {!checking && status === 'PENDING' && (
                <div className="flex items-center gap-3 text-amber-700 dark:text-amber-300">
                  <AlertCircle size={24} />
                  <span>Payment is still pending. Enter card details above, then submit payment.</span>
                </div>
              )}

              {!checking && !status && (
                <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <AlertCircle size={24} />
                  <span>Complete the card form above to finish payment.</span>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleCheckPayment} disabled={checking || !transactionId}>
                {checking ? 'Checking...' : 'Check Status'}
              </Button>
              {orderId && (
                <Button variant="outline" onClick={() => router.push(`/checkout/${orderId}`)}>
                  Back to Checkout
                </Button>
              )}
              <Button variant="outline" onClick={() => router.push('/account/orders')}>
                My Orders
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function PaymentConfirmPage() {
  return (
    <ProtectedRoute>
      <PaymentConfirmContent />
    </ProtectedRoute>
  );
}
