'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi, cartApi } from '@/lib/api';
import { Button } from '@ui/Button';
import { Card, CardContent } from '@ui/Card';
import { Badge } from '@ui/Badge';
import { Skeleton } from '@ui/Skeleton';
import { useParams } from 'next/navigation';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productsApi.getById(productId),
  });

  const addToCartMutation = useMutation({
    mutationFn: (variantId: string) =>
      cartApi.addItem({ variantId, quantity: 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      alert('Added to cart!');
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-96 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const product = data?.data;
  if (!product) return <div>Product not found</div>;

  const variant = selectedVariant
    ? product.variants.find((v: any) => v.id === selectedVariant)
    : product.variants[0];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="h-96 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg flex items-center justify-center">
            <span className="text-9xl">👟</span>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
            <p className="text-2xl font-semibold text-primary">
              ${product.basePrice.toFixed(2)}
            </p>
            <p className="text-muted-foreground mt-2">{product.brand.name}</p>
          </div>

          {product.featured && (
            <Badge variant="secondary">Featured Product</Badge>
          )}

          <p className="text-lg">{product.description}</p>

          {/* Variant Selection */}
          <div>
            <h3 className="font-semibold mb-2">Select Size & Color</h3>
            <div className="grid grid-cols-3 gap-2">
              {product.variants.map((v: any) => (
                <Button
                  key={v.id}
                  variant={selectedVariant === v.id ? 'default' : 'outline'}
                  onClick={() => setSelectedVariant(v.id)}
                  className="flex flex-col h-auto py-2"
                >
                  <span className="text-sm">{v.color}</span>
                  <span className="text-xs">Size {v.size}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Stock Status */}
          {variant && (
            <div>
              <p className="text-sm">
                {variant.inventory?.quantity > 0 ? (
                  <Badge variant="default">In Stock ({variant.inventory.quantity} available)</Badge>
                ) : (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </p>
            </div>
          )}

          {/* Add to Cart */}
          <Button
            size="lg"
            className="w-full"
            disabled={
              !selectedVariant ||
              !variant ||
              variant.inventory?.quantity <= 0 ||
              addToCartMutation.isPending
            }
            onClick={() =>
              selectedVariant && addToCartMutation.mutate(selectedVariant)
            }
          >
            {addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
          </Button>

          {/* Additional Info */}
          <Card>
            <CardContent className="pt-6">
              <h4 className="font-semibold mb-2">Product Details</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>Gender: {product.gender}</li>
                {product.material && <li>Material: {product.material}</li>}
                <li>Category: {product.category.name}</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold mb-6">Customer Reviews</h2>
        {product.reviews && product.reviews.length > 0 ? (
          <div className="space-y-4">
            {product.reviews.map((review: any) => (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold">{review.user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Rating: {review.rating}/5
                      </p>
                    </div>
                  </div>
                  <h4 className="font-semibold mb-1">{review.title}</h4>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
}
