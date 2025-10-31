'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardDescription } from '@ui/Card';
import { Button } from '@ui/Button';
import { Skeleton } from '@ui/Skeleton';
import Link from 'next/link';

export default function ProductsPage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsApi.getAll(filters),
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-64 w-full" />
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const products = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">All Products</h1>

      {/* Filter sidebar would go here */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {products.map((product: any) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-all hover:scale-105 cursor-pointer">
              <div className="h-64 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                <span className="text-8xl">👟</span>
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-1">{product.name}</CardTitle>
                <CardDescription>
                  ${product.basePrice.toFixed(2)}
                </CardDescription>
                <p className="text-sm text-muted-foreground">{product.brand?.name}</p>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            disabled={filters.page === 1}
            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
          >
            Previous
          </Button>
          <span className="flex items-center px-4">
            Page {filters.page} of {meta.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={filters.page >= meta.totalPages}
            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
