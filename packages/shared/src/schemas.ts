import { z } from 'zod';

// User schemas
export const UserSchema = z.object({
  id: z.string().cuid(),
  email: z.string().email(),
  name: z.string().min(2),
  role: z.enum(['USER', 'ADMIN']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Address schema
export const AddressSchema = z.object({
  id: z.string().cuid(),
  userId: z.string().cuid(),
  fullName: z.string().min(2),
  street: z.string().min(3),
  city: z.string().min(2),
  state: z.string().min(2),
  zipCode: z.string().min(3),
  country: z.string().min(2),
  phone: z.string().min(10),
  isDefault: z.boolean().default(false),
});

export const CreateAddressSchema = AddressSchema.omit({ id: true, userId: true });

// Image schema
export const ImageSchema = z.object({
  id: z.string().cuid(),
  url: z.string().url(),
  alt: z.string().optional(),
  order: z.number().int().default(0),
});

// Category schema
export const CategorySchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  imageUrl: z.string().url().optional(),
});

// Brand schema
export const BrandSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  logoUrl: z.string().url().optional(),
});

// Variant schema
export const VariantSchema = z.object({
  id: z.string().cuid(),
  productId: z.string().cuid(),
  color: z.string().min(1),
  size: z.string().min(1),
  sku: z.string().min(1),
  priceAdjustment: z.number().default(0),
  images: z.array(ImageSchema).optional(),
});

export const CreateVariantSchema = VariantSchema.omit({ id: true, productId: true });

// Inventory schema
export const InventorySchema = z.object({
  id: z.string().cuid(),
  variantId: z.string().cuid(),
  quantity: z.number().int().min(0),
  reserved: z.number().int().min(0).default(0),
  lowStockThreshold: z.number().int().default(10),
  updatedAt: z.date(),
});

// Product schema
export const ProductSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().min(10),
  basePrice: z.number().positive(),
  categoryId: z.string().cuid(),
  brandId: z.string().cuid(),
  gender: z.enum(['MEN', 'WOMEN', 'UNISEX', 'KIDS']),
  material: z.string().optional(),
  featured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  images: z.array(ImageSchema).optional(),
  variants: z.array(VariantSchema).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateProductSchema = ProductSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const UpdateProductSchema = CreateProductSchema.partial();

// Review schema
export const ReviewSchema = z.object({
  id: z.string().cuid(),
  productId: z.string().cuid(),
  userId: z.string().cuid(),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3).max(100),
  comment: z.string().min(10).max(1000),
  verified: z.boolean().default(false),
  images: z.array(ImageSchema).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateReviewSchema = ReviewSchema.omit({
  id: true,
  userId: true,
  verified: true,
  createdAt: true,
  updatedAt: true,
});

// Cart schemas
export const CartItemSchema = z.object({
  id: z.string().cuid(),
  cartId: z.string().cuid(),
  variantId: z.string().cuid(),
  quantity: z.number().int().min(1),
  price: z.number().positive(),
});

export const CartSchema = z.object({
  id: z.string().cuid(),
  userId: z.string().cuid().optional(),
  sessionId: z.string().optional(),
  items: z.array(CartItemSchema).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const AddToCartSchema = z.object({
  variantId: z.string().cuid(),
  quantity: z.number().int().min(1).default(1),
});

export const UpdateCartItemSchema = z.object({
  quantity: z.number().int().min(0),
});

// Wishlist schema
export const WishlistSchema = z.object({
  id: z.string().cuid(),
  userId: z.string().cuid(),
  productId: z.string().cuid(),
  createdAt: z.date(),
});

// Order schemas
export const OrderItemSchema = z.object({
  id: z.string().cuid(),
  orderId: z.string().cuid(),
  variantId: z.string().cuid(),
  quantity: z.number().int().min(1),
  price: z.number().positive(),
  productName: z.string(),
  variantColor: z.string(),
  variantSize: z.string(),
});

export const OrderSchema = z.object({
  id: z.string().cuid(),
  userId: z.string().cuid(),
  orderNumber: z.string(),
  status: z.enum([
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
    'REFUNDED',
  ]),
  paymentStatus: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED']),
  paymentIntentId: z.string().optional(),
  subtotal: z.number().positive(),
  tax: z.number().min(0),
  shipping: z.number().min(0),
  discount: z.number().min(0).default(0),
  total: z.number().positive(),
  shippingAddressId: z.string().cuid(),
  items: z.array(OrderItemSchema).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateOrderSchema = z.object({
  items: z.array(
    z.object({
      variantId: z.string().cuid(),
      quantity: z.number().int().min(1),
    })
  ),
  shippingAddressId: z.string().cuid(),
  couponCode: z.string().optional(),
});

// Banner schema
export const BannerSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(3),
  subtitle: z.string().optional(),
  imageUrl: z.string().url(),
  ctaText: z.string().optional(),
  ctaLink: z.string().optional(),
  isActive: z.boolean().default(true),
  order: z.number().int().default(0),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

// Coupon schema
export const CouponSchema = z.object({
  id: z.string().cuid(),
  code: z.string().min(3).max(50),
  type: z.enum(['PERCENTAGE', 'FIXED']),
  value: z.number().positive(),
  minPurchase: z.number().min(0).optional(),
  maxDiscount: z.number().positive().optional(),
  usageLimit: z.number().int().positive().optional(),
  usageCount: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  startDate: z.date(),
  endDate: z.date(),
});

// Query/Filter schemas
export const ProductFilterSchema = z.object({
  categoryId: z.string().cuid().optional(),
  brandId: z.string().cuid().optional(),
  gender: z.enum(['MEN', 'WOMEN', 'UNISEX', 'KIDS']).optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  size: z.string().optional(),
  color: z.string().optional(),
  material: z.string().optional(),
  search: z.string().optional(),
  sort: z
    .enum(['price-asc', 'price-desc', 'name-asc', 'name-desc', 'newest', 'popular'])
    .optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

// API Response schemas
export const SuccessResponseSchema = z.object({
  success: z.literal(true),
  data: z.any(),
  meta: z
    .object({
      page: z.number().int().optional(),
      limit: z.number().int().optional(),
      total: z.number().int().optional(),
      totalPages: z.number().int().optional(),
    })
    .optional(),
});

export const ErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  errors: z.array(z.any()).optional(),
});

// Type exports
export type User = z.infer<typeof UserSchema>;
export type Register = z.infer<typeof RegisterSchema>;
export type Login = z.infer<typeof LoginSchema>;
export type Address = z.infer<typeof AddressSchema>;
export type CreateAddress = z.infer<typeof CreateAddressSchema>;
export type Image = z.infer<typeof ImageSchema>;
export type Category = z.infer<typeof CategorySchema>;
export type Brand = z.infer<typeof BrandSchema>;
export type Variant = z.infer<typeof VariantSchema>;
export type CreateVariant = z.infer<typeof CreateVariantSchema>;
export type Inventory = z.infer<typeof InventorySchema>;
export type Product = z.infer<typeof ProductSchema>;
export type CreateProduct = z.infer<typeof CreateProductSchema>;
export type UpdateProduct = z.infer<typeof UpdateProductSchema>;
export type Review = z.infer<typeof ReviewSchema>;
export type CreateReview = z.infer<typeof CreateReviewSchema>;
export type CartItem = z.infer<typeof CartItemSchema>;
export type Cart = z.infer<typeof CartSchema>;
export type AddToCart = z.infer<typeof AddToCartSchema>;
export type UpdateCartItem = z.infer<typeof UpdateCartItemSchema>;
export type Wishlist = z.infer<typeof WishlistSchema>;
export type OrderItem = z.infer<typeof OrderItemSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type CreateOrder = z.infer<typeof CreateOrderSchema>;
export type Banner = z.infer<typeof BannerSchema>;
export type Coupon = z.infer<typeof CouponSchema>;
export type ProductFilter = z.infer<typeof ProductFilterSchema>;
export type Pagination = z.infer<typeof PaginationSchema>;
export type SuccessResponse = z.infer<typeof SuccessResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
