"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const precio = Number(product.precio).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
  });

  return (
    <Link href={`/productos/${product.id}`} className="card group block">
      {/* Imagen */}
      <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--muted)] text-sm">
            Sin imagen
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-1">
        <h3 className="text-sm font-medium truncate">{product.nombre}</h3>

        <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
          {product.Categorie && <span>{product.Categorie.genero}</span>}
          {product.Color && (
            <>
              <span>·</span>
              <span>{product.Color.nombre}</span>
            </>
          )}
          {product.Talle && (
            <>
              <span>·</span>
              <span>Talle {product.Talle.numero}</span>
            </>
          )}
        </div>

        <p className="text-base font-semibold mt-1">{precio}</p>
      </div>
    </Link>
  );
}
