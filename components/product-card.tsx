'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/status-badge';
import { ShoppingCart } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  sku: string;
  price: string;
  stock: number;
  status: string;
  description?: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const price = parseFloat(product.price);
  const inStock = product.stock > 0;

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-shadow bg-white dark:bg-slate-900">
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1">
            <Link href={`/products/${product.id}`}>
              <h3 className="font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition">
                {product.name}
              </h3>
            </Link>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">SKU: {product.sku}</p>
          </div>
          <StatusBadge status={product.status} type="product" />
        </div>

        {product.description && (
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-slate-900 dark:text-white">
            ${price.toFixed(2)}
          </span>
          <span className={`text-xs ${inStock ? 'text-green-600' : 'text-red-600'}`}>
            {inStock ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>

        <div className="flex gap-2">
          <Link href={`/products/${product.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </Link>
          {onAddToCart && (
            <Button
              onClick={() => onAddToCart(product.id)}
              disabled={!inStock}
              className="gap-2"
            >
              <ShoppingCart size={16} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
