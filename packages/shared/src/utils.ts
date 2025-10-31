/**
 * Format price according to locale
 */
export function formatPrice(
  price: number,
  locale: string = 'en-US',
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(price);
}

/**
 * Format price for Vietnamese locale
 */
export function formatPriceVN(price: number): string {
  return formatPrice(price, 'vi-VN', 'VND');
}

/**
 * Generate a safe ID from a string (for slugs, etc.)
 */
export function safeId(str: string): string {
  // Limit input length to prevent ReDoS
  const truncated = str.slice(0, 200);
  return truncated
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Calculate discount amount
 */
export function calculateDiscount(
  subtotal: number,
  discountType: 'PERCENTAGE' | 'FIXED',
  discountValue: number,
  maxDiscount?: number
): number {
  let discount = 0;

  if (discountType === 'PERCENTAGE') {
    discount = (subtotal * discountValue) / 100;
    if (maxDiscount && discount > maxDiscount) {
      discount = maxDiscount;
    }
  } else {
    discount = Math.min(discountValue, subtotal);
  }

  return discount;
}

/**
 * Calculate tax (simplified - 10% for demo)
 */
export function calculateTax(subtotal: number): number {
  return subtotal * 0.1;
}

/**
 * Calculate shipping cost (simplified)
 */
export function calculateShipping(subtotal: number): number {
  if (subtotal >= 100) {
    return 0; // Free shipping over $100
  }
  return 10; // Flat $10 shipping
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Generate order number
 */
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `ORD-${timestamp}-${random}`.toUpperCase();
}

/**
 * Check if date is within range
 */
export function isDateInRange(
  date: Date,
  startDate?: Date | null,
  endDate?: Date | null
): boolean {
  const now = date.getTime();
  if (startDate && now < startDate.getTime()) {
    return false;
  }
  if (endDate && now > endDate.getTime()) {
    return false;
  }
  return true;
}

/**
 * Constants
 */
export const CONSTANTS = {
  DEFAULT_LOCALE: 'en-US',
  SUPPORTED_LOCALES: ['en-US', 'vi-VN'],
  DEFAULT_CURRENCY: 'USD',
  CURRENCY_MAP: {
    'en-US': 'USD',
    'vi-VN': 'VND',
  } as Record<string, string>,
  TAX_RATE: 0.1,
  FREE_SHIPPING_THRESHOLD: 100,
  FLAT_SHIPPING_COST: 10,
  LOW_STOCK_THRESHOLD: 10,
  ITEMS_PER_PAGE: 20,
  MAX_ITEMS_PER_PAGE: 100,
} as const;
