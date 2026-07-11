// User Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string | null;
  price: string;
  stock: number;
  status: 'ACTIVE' | 'INACTIVE';
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

// Order Types
export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: string;
  subtotal: string;
}

export interface Payment {
  id: string;
  orderId: string;
  provider: 'STRIPE' | 'BKASH';
  transactionId: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  rawResponse?: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: string;
  status: 'PENDING' | 'PAID' | 'CANCELED';
  items: OrderItem[];
  payments: Payment[];
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// Cart Types
export interface CartItem {
  productId: string;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  addItem: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

// Auth State Types
export interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string) => void;
  logout: () => void;
}
