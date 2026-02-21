"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
    HiOutlineHome,
    HiOutlineCube,
    HiOutlineTag,
    HiOutlineColorSwatch,
    HiOutlineTemplate,
    HiOutlineArrowLeft,
    HiOutlineLogout,
} from "react-icons/hi";

const navItems = [
    { href: "/admin", label: "Dashboard", icon: HiOutlineHome },
    { href: "/admin/productos", label: "Productos", icon: HiOutlineCube },
    { href: "/admin/categorias", label: "Categorías", icon: HiOutlineTag },
    { href: "/admin/colores", label: "Colores", icon: HiOutlineColorSwatch },
    { href: "/admin/talles", label: "Talles", icon: HiOutlineTemplate },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        router.push("/login");
    };

    return (
        <aside className="w-64 bg-[#111111] text-white min-h-screen flex flex-col fixed left-0 top-0 z-40">
            {/* Logo / Título */}
            <div className="px-6 py-5 border-b border-white/10">
                <h1 className="text-lg font-bold tracking-tight">STORE Admin</h1>
                <p className="text-xs text-white/50 mt-0.5">Panel de administración</p>
            </div>

            {/* Navegación */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map((item) => {
                    const isActive =
                        item.href === "/admin"
                            ? pathname === "/admin"
                            : pathname.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                    ? "bg-white/15 text-white"
                                    : "text-white/60 hover:bg-white/8 hover:text-white"
                                }`}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="px-3 py-4 border-t border-white/10 space-y-1">
                <Link
                    href="/productos"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:bg-white/8 hover:text-white transition-all"
                >
                    <HiOutlineArrowLeft size={20} />
                    Ir a la tienda
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:bg-white/8 hover:text-white transition-all cursor-pointer"
                >
                    <HiOutlineLogout size={20} />
                    Cerrar sesión
                </button>

                {/* Usuario actual */}
                {user && (
                    <div className="px-3 pt-3 border-t border-white/10 mt-2">
                        <p className="text-xs text-white/40">Conectado como</p>
                        <p className="text-sm text-white/80 font-medium truncate">{user.nombre}</p>
                    </div>
                )}
            </div>
        </aside>
    );
}
