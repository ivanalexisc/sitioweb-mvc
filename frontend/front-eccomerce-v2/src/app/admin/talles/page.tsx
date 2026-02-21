"use client";

import { useEffect, useState } from "react";
import http from "@/lib/http";
import type { Talle } from "@/types";
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiOutlineX, HiOutlineCheck } from "react-icons/hi";

export default function AdminTalles() {
    const [sizes, setSizes] = useState<Talle[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [numero, setNumero] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const fetchSizes = async () => {
        try {
            const { data } = await http.get("/sizes");
            setSizes(data.results || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSizes();
    }, []);

    const resetForm = () => {
        setNumero("");
        setEditingId(null);
        setError("");
        setShowForm(false);
    };

    const openCreate = () => {
        setNumero("");
        setEditingId(null);
        setError("");
        setShowForm(true);
    };

    const openEdit = (size: Talle) => {
        setNumero(String(size.numero));
        setEditingId(size.id);
        setError("");
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        try {
            if (editingId) {
                await http.put(`/sizes/${editingId}`, { numero: parseInt(numero) });
            } else {
                await http.post("/sizes", { numero: parseInt(numero) });
            }
            resetForm();
            fetchSizes();
        } catch (err: any) {
            setError(err.response?.data?.message || "Error al guardar");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Eliminar este talle?")) return;
        try {
            await http.delete(`/sizes/${id}`);
            fetchSizes();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold">Talles</h1>
                <div className="bg-white rounded-xl p-8 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-48 mb-4" />
                    <div className="space-y-3">
                        {[...Array(3)].map((_, i) => <div key={i} className="h-4 bg-gray-200 rounded" />)}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Talles</h1>
                    <p className="text-sm text-gray-500 mt-1">{sizes.length} talles en total</p>
                </div>
                <button onClick={openCreate} className="btn-primary flex items-center gap-2">
                    <HiOutlinePlus size={18} />
                    Nuevo talle
                </button>
            </div>

            {/* Formulario inline */}
            {showForm && (
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                        {editingId ? "Editar talle" : "Crear talle"}
                    </h3>
                    <form onSubmit={handleSubmit} className="flex items-end gap-3">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-600 mb-1">Número de talle</label>
                            <input
                                type="number"
                                value={numero}
                                onChange={(e) => setNumero(e.target.value)}
                                className="input"
                                placeholder="Ej: 38, 40, 42..."
                                required
                                autoFocus
                            />
                        </div>
                        <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                            <HiOutlineCheck size={18} />
                            {saving ? "Guardando..." : "Guardar"}
                        </button>
                        <button type="button" onClick={resetForm} className="btn-outline flex items-center gap-2">
                            <HiOutlineX size={18} />
                            Cancelar
                        </button>
                    </form>
                    {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
                </div>
            )}

            {/* Tabla */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Número</th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {sizes.map((size) => (
                                <tr key={size.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-400 font-mono">{size.id}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{size.numero}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => openEdit(size)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
                                                <HiOutlinePencil size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(size.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                                                <HiOutlineTrash size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {sizes.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-sm text-gray-400">
                                        No hay talles. Creá el primero.
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
