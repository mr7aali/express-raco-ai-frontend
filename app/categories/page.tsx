'use client';

import useSWR from 'swr';
import Link from 'next/link';
import api from '@/lib/api';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

async function fetcher(url: string) {
  const res = await api.get(url);
  return res.data;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
}

export default function CategoriesPage() {
  const { data: categories, isLoading } = useSWR('/api/categories', fetcher);

  // Build category hierarchy
  const rootCategories = categories?.filter((cat: Category) => !cat.parentId) || [];
  const childrenMap: { [key: string]: Category[] } = {};

  categories?.forEach((cat: Category) => {
    if (cat.parentId) {
      if (!childrenMap[cat.parentId]) {
        childrenMap[cat.parentId] = [];
      }
      childrenMap[cat.parentId].push(cat);
    }
  });

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

  if (rootCategories.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
              Categories
            </h1>
            <div className="bg-white dark:bg-slate-900 rounded-lg p-12 text-center">
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">
                No categories available
              </p>
              <Link href="/products">
                <Button>Browse All Products</Button>
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
            Shop by Category
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rootCategories.map((category: Category) => (
              <div
                key={category.id}
                className="bg-white dark:bg-slate-900 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    {category.name}
                  </h2>

                  {/* Subcategories */}
                  {childrenMap[category.id] && childrenMap[category.id].length > 0 && (
                    <div className="mb-6 space-y-2">
                      {childrenMap[category.id].map((child: Category) => (
                        <Link
                          key={child.id}
                          href={`/products?categoryId=${child.id}`}
                          className="block text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
                        >
                          • {child.name}
                        </Link>
                      ))}
                    </div>
                  )}

                  <Link href={`/products?categoryId=${category.id}`}>
                    <Button className="w-full gap-2">
                      Browse <ChevronRight size={18} />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
