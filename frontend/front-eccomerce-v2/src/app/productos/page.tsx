"use client";

import { useEffect, useState, useCallback } from "react";
import http from "@/lib/http";
import type { Product, ProductFilters, ProductListResponse } from "@/types";
import ProductCard from "@/components/ProductCard";
import FilterSidebar from "@/components/FilterSidebar";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<ProductFilters>({ page: 1, limit: 12 });
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = {};
      if (filters.categoria) params.categoria = filters.categoria;
      if (filters.color) params.color = filters.color;
      if (filters.talle) params.talle = filters.talle;
      params.page = filters.page ?? 1;
      params.limit = filters.limit ?? 12;

      const { data } = await http.get<ProductListResponse>("/products", { params });
      setProducts(data.results);
      setMeta({
        total: data.metadata.total,
        page: data.metadata.page,
        totalPages: data.metadata.totalPages,
      });
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilterChange = (newFilters: ProductFilters) => {
    setFilters(newFilters);
  };

  const goToPage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex gap-8">
      {/* Sidebar */}
      <FilterSidebar filters={filters} onChange={handleFilterChange} />

      {/* Main content */}
      <div className="flex-1 flex flex-col gap-6">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight">Catálogo</h1>
          <span className="text-sm text-[var(--muted)]">
            {meta.total} producto{meta.total !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Product grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-md" />
                <div className="mt-3 h-4 bg-gray-200 rounded w-3/4" />
                <div className="mt-2 h-4 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[var(--muted)]">
            <p className="text-lg">No se encontraron productos</p>
            <p className="text-sm mt-1">Probá ajustando los filtros</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              onClick={() => goToPage(meta.page - 1)}
              disabled={meta.page <= 1}
              className="w-9 h-9 flex items-center justify-center rounded-md border border-[var(--border)] disabled:opacity-30 hover:bg-gray-100 transition-colors"
            >
              <HiChevronLeft size={18} />
            </button>

            {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
              .filter((p) => {
                // Show first, last, and pages near current
                return p === 1 || p === meta.totalPages || Math.abs(p - meta.page) <= 1;
              })
              .reduce<(number | "dots")[]>((acc, p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("dots");
                acc.push(p);
                return acc;
              }, [])
              .map((item, i) =>
                item === "dots" ? (
                  <span key={`dots-${i}`} className="px-1 text-[var(--muted)]">
                    …
                  </span>
                ) : (
                  <button
                    key={item}
                    onClick={() => goToPage(item as number)}
                    className={`w-9 h-9 flex items-center justify-center rounded-md text-sm transition-colors ${
                      meta.page === item
                        ? "bg-[var(--accent)] text-white"
                        : "border border-[var(--border)] hover:bg-gray-100"
                    }`}
                  >
                    {item}
                  </button>
                )
              )}

            <button
              onClick={() => goToPage(meta.page + 1)}
              disabled={meta.page >= meta.totalPages}
              className="w-9 h-9 flex items-center justify-center rounded-md border border-[var(--border)] disabled:opacity-30 hover:bg-gray-100 transition-colors"
            >
              <HiChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
