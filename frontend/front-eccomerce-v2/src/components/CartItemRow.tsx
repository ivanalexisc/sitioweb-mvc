"use client";

import { useCart } from "@/context/CartContext";
import type { CartItem } from "@/types";
import { HiOutlineTrash, HiMinus, HiPlus } from "react-icons/hi";

interface Props {
  item: CartItem;
}

export default function CartItemRow({ item }: Props) {
  const { updateQuantity, removeFromCart } = useCart();

  const precio = Number(item.precio).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });

  const subtotal = Number(item.subtotal).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.productId, item.quantity - 1);
    }
  };

  const handleIncrement = () => {
    updateQuantity(item.productId, item.quantity + 1);
  };

  return (
    <div className="flex items-center gap-4 py-4 border-b border-[var(--border)]">
      {/* Imagen */}
      <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
        {item.image ? (
          <img src={item.image} alt={item.nombre} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--muted)] text-xs">
            Sin img
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium truncate">{item.nombre}</h4>
        <p className="text-xs text-[var(--muted)] mt-0.5">{precio} c/u</p>
      </div>

      {/* Controles de cantidad */}
      <div className="flex items-center gap-2 border border-[var(--border)] rounded-md">
        <button
          onClick={handleDecrement}
          disabled={item.quantity <= 1}
          className="px-2 py-1 hover:bg-gray-100 disabled:opacity-30 transition-colors"
        >
          <HiMinus size={14} />
        </button>
        <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
        <button
          onClick={handleIncrement}
          className="px-2 py-1 hover:bg-gray-100 transition-colors"
        >
          <HiPlus size={14} />
        </button>
      </div>

      {/* Subtotal */}
      <p className="text-sm font-semibold w-24 text-right">{subtotal}</p>

      {/* Eliminar */}
      <button
        onClick={() => removeFromCart(item.productId)}
        className="text-[var(--muted)] hover:text-[var(--danger)] transition-colors p-1"
      >
        <HiOutlineTrash size={18} />
      </button>
    </div>
  );
}
