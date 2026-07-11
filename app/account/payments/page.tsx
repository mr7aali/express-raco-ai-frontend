'use client';

import useSWR from 'swr';
import api from '@/lib/api';
import { Navbar } from '@/components/navbar';
import { ProtectedRoute } from '@/components/protected-route';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

async function fetcher(url: string) {
  const res = await api.get(url);
  return res.data;
}

function PaymentsContent() {
  const router = useRouter();
  const { data: payments, isLoading } = useSWR(
    '/api/users/me/payments',
    fetcher
  );

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin">
              <div className="w-12 h-12 border-4 border-slate-300 dark:border-slate-700 border-t-blue-500 rounded-full mx-auto"></div>
            </div>
            <p className="mt-4 text-slate-600 dark:text-slate-400">Loading payments...</p>
          </div>
        </div>
      </>
    );
  }

  if (payments?.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
              Payment History
            </h1>
            <div className="bg-white dark:bg-slate-900 rounded-lg p-12 text-center">
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">
                No payments yet
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
            Payment History
          </h1>

          <div className="bg-white dark:bg-slate-900 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                      Provider
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                      Transaction ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {payments?.map((payment: any) => (
                    <tr key={payment.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                      <td className="px-6 py-4">
                        <button
                          onClick={() => router.push(`/account/orders/${payment.orderId}`)}
                          className="font-mono text-sm text-blue-600 hover:text-blue-700 truncate"
                        >
                          {payment.orderId}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={payment.provider} type="provider" />
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={payment.status} type="payment" />
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-slate-700 dark:text-slate-300 truncate">
                          {payment.transactionId}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {new Date(payment.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function PaymentsPage() {
  return (
    <ProtectedRoute>
      <PaymentsContent />
    </ProtectedRoute>
  );
}
