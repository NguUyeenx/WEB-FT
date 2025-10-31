const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data.message || 'Something went wrong',
      response.status,
      data
    );
  }

  return data;
}

// Auth API
export const authApi = {
  register: (data: { email: string; password: string; name: string }) =>
    apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  me: () => apiRequest('/api/auth/me'),
};

// Products API
export const productsApi = {
  getAll: (params?: Record<string, any>) => {
    const searchParams = new URLSearchParams(params).toString();
    return apiRequest(`/api/products${searchParams ? `?${searchParams}` : ''}`);
  },

  getById: (id: string) => apiRequest(`/api/products/${id}`),

  getFeatured: () => apiRequest('/api/products/featured/list'),
};

// Cart API
export const cartApi = {
  get: () => apiRequest('/api/carts'),

  addItem: (data: { variantId: string; quantity: number }) =>
    apiRequest('/api/carts/items', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateItem: (itemId: string, data: { quantity: number }) =>
    apiRequest(`/api/carts/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  clear: () =>
    apiRequest('/api/carts', {
      method: 'DELETE',
    }),
};

// Orders API
export const ordersApi = {
  getAll: () => apiRequest('/api/orders'),

  getById: (id: string) => apiRequest(`/api/orders/${id}`),

  create: (data: any) =>
    apiRequest('/api/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Wishlist API
export const wishlistApi = {
  get: () => apiRequest('/api/wishlists'),

  add: (productId: string) =>
    apiRequest('/api/wishlists', {
      method: 'POST',
      body: JSON.stringify({ productId }),
    }),

  remove: (productId: string) =>
    apiRequest(`/api/wishlists/${productId}`, {
      method: 'DELETE',
    }),
};

// Reviews API
export const reviewsApi = {
  create: (data: any) =>
    apiRequest('/api/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getByProduct: (productId: string) =>
    apiRequest(`/api/reviews/product/${productId}`),
};
