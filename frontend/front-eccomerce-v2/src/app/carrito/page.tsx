"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import CartItemRow from "@/components/CartItemRow";
import { HiOutlineShoppingBag, HiOutlineTrash } from "react-icons/hi";

export default function CarritoPage() {
  const { items, total, loading, fetchCart, clearCart, itemCount } = useCart();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (user) fetchCart();
  }, [user, authLoading, fetchCart, router]);

  const formattedTotal = Number(total).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });

  if (authLoading || loading) {
    return (
      <div className="max-w-3xl mx-auto animate-pulse flex flex-col gap-4">
        <div className="h-8 bg-gray-200 rounded w-40" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 py-4 border-b border-[var(--border)]">
            <div className="w-20 h-20 bg-gray-200 rounded-md" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>
            <div className="h-8 bg-gray-200 rounded w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center py-24 gap-5 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
          <HiOutlineShoppingBag size={36} className="text-[var(--muted)]" />
        </div>
        <h1 className="text-xl font-semibold">Tu carrito está vacío</h1>
        <p className="text-sm text-[var(--muted)]">
          Explorá el catálogo y agregá productos que te gusten.
        </p>
        <Link href="/productos" className="btn-primary mt-2">
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">
          Carrito{" "}
          <span className="text-[var(--muted)] font-normal text-base">
            ({itemCount} {itemCount === 1 ? "item" : "items"})
          </span>
        </h1>
        <button
          onClick={clearCart}
          className="flex items-center gap-1.5 text-sm text-[var(--danger)] hover:underline"
        >
          <HiOutlineTrash size={16} />
          Vaciar carrito
        </button>
      </div>

      {/* Items */}
      <div className="card !p-0 divide-y divide-[var(--border)]">
        {items.map((item) => (
          <CartItemRow key={item.productId} item={item} />
        ))}
      </div>

      {/* Summary */}
      <div className="card flex flex-col gap-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--muted)]">Subtotal ({itemCount} productos)</span>
          <span className="font-medium">{formattedTotal}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-[var(--muted)]">Envío</span>
          <span className="text-[var(--success)] font-medium">Gratis</span>
        </div>
        <div className="border-t border-[var(--border)] pt-4 flex items-center justify-between">
          <span className="text-lg font-semibold">Total</span>
          <span className="text-lg font-bold">{formattedTotal}</span>
        </div>
        <button className="btn-primary h-12 text-base w-full mt-2">
          Finalizar compra
        </button>
      </div>

      {/* Keep browsing link */}
      <Link
        href="/productos"
        className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] text-center transition-colors"
      >
        ← Seguir comprando
      </Link>
    </div>
  );
}
