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
    HiOutlineX,
} from "react-icons/hi";

const navItems = [
    { href: "/admin", label: "Dashboard", icon: HiOutlineHome },
    { href: "/admin/productos", label: "Productos", icon: HiOutlineCube },
    { href: "/admin/categorias", label: "Categorías", icon: HiOutlineTag },
    { href: "/admin/colores", label: "Colores", icon: HiOutlineColorSwatch },
    { href: "/admin/talles", label: "Talles", icon: HiOutlineTemplate },
];

interface AdminSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        router.push("/login");
        onClose();
    };

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            <aside
                className={`w-64 bg-[#111111] text-white min-h-screen flex flex-col fixed left-0 top-0 z-50 transform transition-transform duration-200 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                {/* Logo / Título */}
                <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold tracking-tight">STORE Admin</h1>
                        <p className="text-xs text-white/50 mt-0.5">Panel de administración</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="lg:hidden text-white/70 hover:text-white cursor-pointer"
                        aria-label="Cerrar menú"
                    >
                        <HiOutlineX size={20} />
                    </button>
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
                                onClick={onClose}
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
                        onClick={onClose}
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
        </>
    );
}
