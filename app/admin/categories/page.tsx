'use client';

import { useState } from 'react';
import useSWR from 'swr';
import api, { unwrapApiArray } from '@/lib/api';
import { Navbar } from '@/components/navbar';
import { ProtectedRoute } from '@/components/protected-route';
import { Button } from '@/components/ui/button';
import { Trash2, AlertCircle, Plus } from 'lucide-react';

async function fetcher(url: string) {
  const res = await api.get(url);
  return res.data;
}

function AdminCategoriesContent() {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', slug: '', parentId: '' });
  const [submitting, setSubmitting] = useState(false);

  const { data: categories, isLoading, mutate } = useSWR(
    '/api/categories',
    fetcher
  );
  const categoryList = unwrapApiArray<any>(categories);

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      setDeletingId(categoryId);
      await api.delete(`/api/categories/${categoryId}`);
      mutate();
      alert('Category deleted successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete category');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload: any = {
        name: formData.name,
        slug: formData.slug,
      };
      if (formData.parentId) {
        payload.parentId = formData.parentId;
      }

      await api.post('/api/categories', payload);
      mutate();
      setFormData({ name: '', slug: '', parentId: '' });
      setShowForm(false);
      alert('Category created successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create category');
    } finally {
      setSubmitting(false);
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
            <p className="mt-4 text-slate-600 dark:text-slate-400">Loading categories...</p>
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
              Categories
            </h1>
            <Button onClick={() => setShowForm(!showForm)} className="gap-2">
              <Plus size={20} />
              Add Category
            </Button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {showForm && (
            <div className="mb-8 bg-white dark:bg-slate-900 rounded-lg p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                Create New Category
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Electronics"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Slug *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., electronics"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Parent Category
                  </label>
                  <select
                    value={formData.parentId}
                    onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">None (Root Category)</option>
                    {categoryList.map((cat: any) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? 'Creating...' : 'Create Category'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {categoryList.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-lg p-12 text-center">
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">
                No categories yet
              </p>
              <Button onClick={() => setShowForm(true)}>Create First Category</Button>
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
                        Slug
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                        Parent Category
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {categoryList.map((category: any) => (
                      <tr key={category.id} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                        <td className="px-6 py-4">
                          <span className="text-slate-900 dark:text-white font-medium">
                            {category.name}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm text-slate-600 dark:text-slate-400">
                            {category.slug}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-slate-600 dark:text-slate-400">
                            {category.parentId ? 'Child' : 'Root'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(category.id)}
                              disabled={deletingId === category.id}
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

export default function AdminCategoriesPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <AdminCategoriesContent />
    </ProtectedRoute>
  );
}
