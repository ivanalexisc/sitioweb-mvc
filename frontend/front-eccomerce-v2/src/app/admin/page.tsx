"use client";

import { useEffect, useState } from "react";
import http from "@/lib/http";
import {
    HiOutlineCube,
    HiOutlineUserGroup,
    HiOutlineTag,
    HiOutlineColorSwatch,
    HiOutlineTemplate,
} from "react-icons/hi";
import type { Product } from "@/types";
import { resolveImageUrl } from "@/lib/resolveImageUrl";

interface Stats {
    totalProducts: number;
    totalUsers: number;
    totalCategories: number;
    totalColors: number;
    totalSizes: number;
}

const statCards = [
    { key: "totalProducts" as const, label: "Productos", icon: HiOutlineCube, color: "bg-blue-500" },
    { key: "totalUsers" as const, label: "Usuarios", icon: HiOutlineUserGroup, color: "bg-emerald-500" },
    { key: "totalCategories" as const, label: "Categorías", icon: HiOutlineTag, color: "bg-purple-500" },
    { key: "totalColors" as const, label: "Colores", icon: HiOutlineColorSwatch, color: "bg-amber-500" },
    { key: "totalSizes" as const, label: "Talles", icon: HiOutlineTemplate, color: "bg-rose-500" },
];

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [recentProducts, setRecentProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await http.get("/admin/stats");
                setStats(data.stats);
                setRecentProducts(data.recentProducts || []);
            } catch (error) {
                console.error("Error al cargar stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-20 mb-3" />
                            <div className="h-8 bg-gray-200 rounded w-12" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500 mt-1">Resumen general de la tienda</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {statCards.map((card) => (
                    <div
                        key={card.key}
                        className="bg-white rounded-xl p-5 border border-gray-100 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`${card.color} p-2 rounded-lg`}>
                                <card.icon size={20} className="text-white" />
                            </div>
                            <span className="text-sm font-medium text-gray-500">{card.label}</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">
                            {stats ? stats[card.key] : 0}
                        </p>
                    </div>
                ))}
            </div>

            {/* Productos recientes */}
            <div className="bg-white rounded-xl border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Productos recientes</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Producto</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoría</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {recentProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {resolveImageUrl(product.image) && (
                                                <img
                                                    src={resolveImageUrl(product.image) || ""}
                                                    alt={product.nombre}
                                                    className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                                                />
                                            )}
                                            <span className="text-sm font-medium text-gray-900">{product.nombre}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        ${Number(product.precio).toLocaleString("es-AR")}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {product.Categorie?.genero || "—"}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.status === "activo"
                                                    ? "bg-emerald-50 text-emerald-700"
                                                    : "bg-red-50 text-red-700"
                                                }`}
                                        >
                                            {product.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {recentProducts.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-400">
                                        No hay productos aún
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
