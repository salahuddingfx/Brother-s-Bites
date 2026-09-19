'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import api from '@/lib/api';
import { Cart, MenuItem } from '@/types';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addItem: (item: MenuItem, quantity?: number, specialInstructions?: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  cartCount: number;
  cartTotal: number;
  refreshCart: () => Promise<void>;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType>({
  cart: null,
  loading: false,
  addItem: async () => {},
  updateQuantity: async () => {},
  removeItem: async () => {},
  clearCart: async () => {},
  cartCount: 0,
  cartTotal: 0,
  refreshCart: async () => {},
  isCartOpen: false,
  setIsCartOpen: () => {},
  openCart: () => {},
  closeCart: () => {},
  toggleCart: () => {},
});

export const useCart = () => useContext(CartContext);

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('bb_session_id');
  if (!id) {
    id = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('bb_session_id', id);
  }
  return id;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  const refreshCart = useCallback(async () => {
    try {
      const sessionId = getSessionId();
      const res = await api.get('/cart', { headers: { 'x-session-id': sessionId } });
      setCart(res.data.data || res.data);
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = async (item: MenuItem, quantity = 1, specialInstructions = '') => {
    const sessionId = getSessionId();
    const res = await api.post(
      '/cart/items',
      {
        menuItem: item._id,
        name: item.name,
        price: item.price,
        quantity,
        image: item.image,
        specialInstructions,
      },
      { headers: { 'x-session-id': sessionId } }
    );
    setCart(res.data.data || res.data);
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    const sessionId = getSessionId();
    const res = await api.patch(
      `/cart/items/${itemId}`,
      { quantity },
      { headers: { 'x-session-id': sessionId } }
    );
    setCart(res.data.data || res.data);
  };

  const removeItem = async (itemId: string) => {
    const sessionId = getSessionId();
    const res = await api.delete(`/cart/items/${itemId}`, {
      headers: { 'x-session-id': sessionId },
    });
    setCart(res.data.data || res.data);
  };

  const clearCart = async () => {
    const sessionId = getSessionId();
    await api.delete('/cart', { headers: { 'x-session-id': sessionId } });
    setCart(null);
  };

  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const cartTotal = cart?.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        cartCount,
        cartTotal,
        refreshCart,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
