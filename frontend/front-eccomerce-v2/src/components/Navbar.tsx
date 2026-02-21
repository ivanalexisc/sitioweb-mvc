"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { HiOutlineShoppingBag, HiOutlineUser, HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import { useState } from "react";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/productos" className="text-xl font-bold tracking-tight">
          STORE
        </Link>

        {/* Links centro — desktop */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/productos" className="hover:opacity-70 transition-opacity">
            Productos
          </Link>
          {isAdmin && (
            <Link href="/admin" className="hover:opacity-70 transition-opacity text-[var(--accent)]">
              Admin
            </Link>
          )}
        </div>

        {/* Acciones derecha — desktop */}
        <div className="hidden md:flex items-center gap-5">
          {user ? (
            <>
              <span className="text-sm text-[var(--muted)]">
                Hola, {user.nombre}
              </span>
              <button onClick={handleLogout} className="text-sm hover:opacity-70 transition-opacity">
                Salir
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm hover:opacity-70 transition-opacity">
                Ingresar
              </Link>
              <Link href="/register" className="text-sm hover:opacity-70 transition-opacity">
                Registrarse
              </Link>
            </>
          )}

          {/* Carrito */}
          <Link href="/carrito" className="relative">
            <HiOutlineShoppingBag size={22} />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[var(--accent)] text-white text-[10px] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </Link>
        </div>

        {/* Hamburger — mobile */}
        <div className="flex md:hidden items-center gap-4">
          <Link href="/carrito" className="relative">
            <HiOutlineShoppingBag size={22} />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[var(--accent)] text-white text-[10px] font-bold w-4.5 h-4.5 flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </Link>
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <HiOutlineX size={24} /> : <HiOutlineMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-white px-4 pb-4 pt-2 flex flex-col gap-3 text-sm">
          <Link href="/productos" onClick={() => setMenuOpen(false)} className="py-1">
            Productos
          </Link>
          {isAdmin && (
            <Link href="/admin" onClick={() => setMenuOpen(false)} className="py-1 text-[var(--accent)] font-medium">
              Admin
            </Link>
          )}
          {user ? (
            <>
              <span className="text-[var(--muted)]">Hola, {user.nombre}</span>
              <button onClick={handleLogout} className="text-left py-1">
                Salir
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMenuOpen(false)} className="py-1">
                Ingresar
              </Link>
              <Link href="/register" onClick={() => setMenuOpen(false)} className="py-1">
                Registrarse
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
