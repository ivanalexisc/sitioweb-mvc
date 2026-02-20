"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import http from "@/lib/http";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import type { Product, ProductDetailResponse } from "@/types";
import { HiArrowLeft, HiShoppingCart, HiCheckCircle } from "react-icons/hi";

export default function ProductoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await http.get<ProductDetailResponse>(`/products/${id}`);
        setProduct(data.product);
      } catch {
        setError("Producto no encontrado");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setAdding(true);
    try {
      await addToCart(product!.id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch {
      setError("Error al agregar al carrito");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 gap-10 animate-pulse">
        <div className="aspect-square bg-gray-200 rounded-xl" />
        <div className="flex flex-col gap-4 py-4">
          <div className="h-8 bg-gray-200 rounded w-3/4" />
          <div className="h-6 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mt-4" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-12 bg-gray-200 rounded w-full mt-8" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-lg text-[var(--muted)]">{error || "Producto no encontrado"}</p>
        <button onClick={() => router.push("/productos")} className="btn-outline text-sm">
          Volver al catálogo
        </button>
      </div>
    );
  }

  const imgSrc = product.image
    ? `http://localhost:3001/images/${product.image}`
    : "/placeholder.png";

  return (
    <div className="flex flex-col gap-6">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-[var(--muted)] hover:text-[var(--foreground)] transition-colors w-fit"
      >
        <HiArrowLeft size={16} />
        Volver
      </button>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="relative aspect-square bg-white rounded-xl overflow-hidden border border-[var(--border)]">
          <Image
            src={imgSrc}
            alt={product.nombre}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5 py-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-[var(--muted)] mb-1">
              {product.Categorie?.genero}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">{product.nombre}</h1>
          </div>

          <p className="text-3xl font-bold">
            ${product.precio.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
          </p>

          {/* Attributes */}
          <div className="flex flex-col gap-3 border-t border-[var(--border)] pt-5">
            <div className="flex items-center gap-3">
              <span className="text-sm text-[var(--muted)] w-16">Color</span>
              <span className="text-sm font-medium px-3 py-1 bg-gray-100 rounded-md">
                {product.Color?.nombre}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-[var(--muted)] w-16">Talle</span>
              <span className="text-sm font-medium px-3 py-1 bg-gray-100 rounded-md">
                {product.Talle?.numero}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-[var(--muted)] w-16">Stock</span>
              <span className={`text-sm font-medium ${product.cantidad > 0 ? "text-[var(--success)]" : "text-[var(--danger)]"}`}>
                {product.cantidad > 0 ? `${product.cantidad} disponibles` : "Sin stock"}
              </span>
            </div>
          </div>

          {/* Quantity + Add to cart */}
          {product.cantidad > 0 && (
            <div className="flex flex-col gap-3 border-t border-[var(--border)] pt-5 mt-auto">
              <div className="flex items-center gap-3">
                <span className="text-sm text-[var(--muted)]">Cantidad</span>
                <div className="flex items-center border border-[var(--border)] rounded-md">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.cantidad, q + 1))}
                    className="w-9 h-9 flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={adding}
                className={`btn-primary flex items-center justify-center gap-2 h-12 text-base transition-all ${
                  added ? "!bg-[var(--success)]" : ""
                }`}
              >
                {added ? (
                  <>
                    <HiCheckCircle size={20} />
                    Agregado
                  </>
                ) : (
                  <>
                    <HiShoppingCart size={20} />
                    {adding ? "Agregando…" : "Agregar al carrito"}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
