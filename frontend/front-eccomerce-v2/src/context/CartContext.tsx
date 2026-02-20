"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import http from "@/lib/http";
import type { CartItem } from "@/types";

interface CartContextType {
  items: CartItem[];
  total: number;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await http.get("/cart");
      setItems(data.items);
      setTotal(data.total);
    } catch {
      // Si no está autenticado, el carrito queda vacío
      setItems([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = async (productId: number, quantity = 1) => {
    const { data } = await http.post("/cart", { productId, quantity });
    setItems(data.items);
    setTotal(data.total);
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    const { data } = await http.put(`/cart/${productId}`, { quantity });
    setItems(data.items);
    setTotal(data.total);
  };

  const removeFromCart = async (productId: number) => {
    const { data } = await http.delete(`/cart/${productId}`);
    setItems(data.items);
    setTotal(data.total);
  };

  const clearCart = async () => {
    await http.delete("/cart");
    setItems([]);
    setTotal(0);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, total, loading, fetchCart, addToCart, updateQuantity, removeFromCart, clearCart, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return context;
}
