'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, type RegisterInput } from '@/lib/schemas';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/navbar';

export default function RegisterPage() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    try {
      setError('');
      setLoading(true);

      // Register
      await api.post('/api/auth/register', {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      // Login after registration
      const loginResponse = await api.post('/api/auth/login', {
        email: data.email,
        password: data.password,
      });

      const { user, token } = loginResponse.data;
      setToken(token);
      setUser(user);
      router.push('/products');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Create Account
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Join us to start shopping
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-200 rounded-md text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Email
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Password
                </label>
                <input
                  type="password"
                  {...register('password')}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  {...register('confirmPassword')}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <p className="mt-6 text-center text-slate-600 dark:text-slate-400">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
