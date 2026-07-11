import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

interface CartStore {
  items: CartItem[];
  addItem: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useAuthStore = create<AuthStore>(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => {
        set({ token });
        Cookies.set('token', token, { expires: 7 });
      },
      logout: () => {
        set({ user: null, token: null });
        Cookies.remove('token');
      },
    }),
    {
      name: 'auth-store',
    }
  )
);

export const useCartStore = create<CartStore>(
  persist(
    (set) => ({
      items: [],
      addItem: (productId, quantity) =>
        set((state) => {
          const existing = state.items.find((item) => item.productId === productId);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.productId === productId
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return { items: [...state.items, { productId, quantity }] };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-store',
    }
  )
);
