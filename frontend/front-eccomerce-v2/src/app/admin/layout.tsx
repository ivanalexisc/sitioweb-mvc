"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { HiOutlineMenu } from "react-icons/hi";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading, isAdmin } = useAuth();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!loading && (!user || !isAdmin)) {
            router.replace("/productos");
        }
    }, [user, loading, isAdmin, router]);

    // Mientras carga o si no es admin, mostrar loading
    if (loading || !user || !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
                <div className="animate-pulse text-[var(--muted)]">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <main className="lg:ml-64 p-4 lg:p-8">
                <header className="lg:hidden bg-white border border-gray-100 rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-gray-600 hover:text-gray-900 cursor-pointer"
                        aria-label="Abrir menú"
                    >
                        <HiOutlineMenu size={22} />
                    </button>
                    <div className="text-right">
                        <p className="text-xs text-gray-500">Admin</p>
                        <p className="text-sm font-semibold text-gray-900">{user.nombre}</p>
                    </div>
                </header>
                {children}
            </main>
        </div>
    );
}
