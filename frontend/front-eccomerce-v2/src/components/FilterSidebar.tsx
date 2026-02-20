"use client";

import { useEffect, useState } from "react";
import http from "@/lib/http";
import type { Categorie, Color, Talle, ProductFilters } from "@/types";
import { HiOutlineAdjustments, HiOutlineX } from "react-icons/hi";

interface Props {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
}

export default function FilterSidebar({ filters, onChange }: Props) {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Talle[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      http.get("/categories"),
      http.get("/colors"),
      http.get("/sizes"),
    ]).then(([catRes, colRes, sizeRes]) => {
      setCategories(catRes.data.results);
      setColors(colRes.data.results);
      setSizes(sizeRes.data.results);
    });
  }, []);

  const handleSelect = (key: keyof ProductFilters, value: number) => {
    const newFilters = { ...filters, page: 1 };
    if (newFilters[key] === value) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    onChange(newFilters);
  };

  const clearFilters = () => {
    onChange({ page: 1, limit: filters.limit });
  };

  const hasActiveFilters = filters.categoria || filters.color || filters.talle;

  const filterContent = (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-wide">Filtros</h2>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="text-xs text-[var(--muted)] hover:text-[var(--foreground)] underline">
            Limpiar
          </button>
        )}
      </div>

      {/* Categorías */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Categoría</h3>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleSelect("categoria", cat.id)}
            className={`text-left text-sm px-3 py-1.5 rounded-md transition-colors ${
              filters.categoria === cat.id
                ? "bg-[var(--accent)] text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {cat.genero}
          </button>
        ))}
      </div>

      {/* Colores */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Color</h3>
        {colors.map((col) => (
          <button
            key={col.id}
            onClick={() => handleSelect("color", col.id)}
            className={`text-left text-sm px-3 py-1.5 rounded-md transition-colors ${
              filters.color === col.id
                ? "bg-[var(--accent)] text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {col.nombre}
          </button>
        ))}
      </div>

      {/* Talles */}
      <div className="flex flex-col gap-2">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Talle</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size.id}
              onClick={() => handleSelect("talle", size.id)}
              className={`text-sm w-10 h-10 flex items-center justify-center rounded-md border transition-colors ${
                filters.talle === size.id
                  ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                  : "border-[var(--border)] hover:bg-gray-100"
              }`}
            >
              {size.numero}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:block w-56 flex-shrink-0">
        {filterContent}
      </aside>

      {/* Mobile filter button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-40 bg-[var(--accent)] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
      >
        <HiOutlineAdjustments size={22} />
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <div className="relative bg-white w-72 h-full p-6 overflow-y-auto ml-auto">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 text-[var(--muted)]"
            >
              <HiOutlineX size={20} />
            </button>
            {filterContent}
          </div>
        </div>
      )}
    </>
  );
}
