"use client";

import { useEffect, useState } from "react";
import http from "@/lib/http";
import type { Product, Categorie, Color, Talle } from "@/types";
import { HiOutlinePencil, HiOutlineTrash, HiOutlinePlus, HiOutlineX } from "react-icons/hi";

export default function AdminProductos() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Categorie[]>([]);
    const [colors, setColors] = useState<Color[]>([]);
    const [sizes, setSizes] = useState<Talle[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // Form state
    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState("");
    const [cantidad, setCantidad] = useState("");
    const [categoria, setCategoria] = useState("");
    const [color, setColor] = useState("");
    const [talle, setTalle] = useState("");
    const [image, setImage] = useState<File | null>(null);

    const fetchProducts = async () => {
        try {
            const { data } = await http.get("/products?limit=100");
            setProducts(data.results || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCatalog = async () => {
        const [catRes, colRes, sizeRes] = await Promise.all([
            http.get("/categories"),
            http.get("/colors"),
            http.get("/sizes"),
        ]);
        setCategories(catRes.data.results);
        setColors(colRes.data.results);
        setSizes(sizeRes.data.results);
    };

    useEffect(() => {
        fetchProducts();
        fetchCatalog();
    }, []);

    const resetForm = () => {
        setNombre("");
        setPrecio("");
        setCantidad("");
        setCategoria("");
        setColor("");
        setTalle("");
        setImage(null);
        setEditingId(null);
        setError("");
    };

    const openCreate = () => {
        resetForm();
        setShowForm(true);
    };

    const openEdit = (product: Product) => {
        setNombre(product.nombre);
        setPrecio(String(product.precio));
        setCantidad(String(product.cantidad));
        setCategoria(String(product.id_categoria));
        setColor(String(product.id_color));
        setTalle(String(product.id_talle));
        setImage(null);
        setEditingId(product.id);
        setError("");
        setShowForm(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        if (!editingId && !image) {
            setError("Debes seleccionar una imagen para crear el producto");
            setSaving(false);
            return;
        }

        const formData = new FormData();
        formData.append("nombre", nombre);
        formData.append("precio", precio);
        formData.append("cantidad", cantidad);
        formData.append("categoria", categoria);
        formData.append("color", color);
        formData.append("talle", talle);
        if (image) formData.append("image", image);

        try {
            if (editingId) {
                await http.put(`/products/${editingId}`, formData);
            } else {
                await http.post("/products", formData);
            }
            setShowForm(false);
            resetForm();
            fetchProducts();
        } catch (err: any) {
            const responseData = err.response?.data;
            const validationMessage = responseData?.errors?.[0]?.msg;
            setError(responseData?.message || validationMessage || "Error al guardar producto");
        } finally {
            setSaving(false);
        }
    };

    const resolveImageUrl = (imagePath: string | null) => {
        if (!imagePath) return null;

        let normalized = imagePath.replace(/\\/g, "/");

        if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
            return normalized;
        }

        normalized = normalized.replace(/^public\//, "");

        if (!normalized.includes("/")) {
            normalized = `images/${normalized}`;
        }

        return `http://localhost:3001/${normalized}`;
    };

    const handleDelete = async (id: number) => {
        if (!confirm("¿Estás seguro de eliminar este producto?")) return;
        try {
            await http.delete(`/products/${id}`);
            fetchProducts();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold">Productos</h1>
                <div className="bg-white rounded-xl p-8 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-48 mb-4" />
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-4 bg-gray-200 rounded" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
                    <p className="text-sm text-gray-500 mt-1">{products.length} productos en total</p>
                </div>
                <button onClick={openCreate} className="btn-primary flex items-center gap-2">
                    <HiOutlinePlus size={18} />
                    Nuevo producto
                </button>
            </div>

            {/* Modal / Formulario */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-semibold">
                                {editingId ? "Editar producto" : "Nuevo producto"}
                            </h2>
                            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                                <HiOutlineX size={22} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {error && (
                                <div className="bg-red-50 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="input" required />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
                                    <input type="number" step="0.01" value={precio} onChange={(e) => setPrecio(e.target.value)} className="input" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                                    <input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} className="input" required />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                                    <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="input" required>
                                        <option value="">Seleccionar</option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>{c.genero}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                                    <select value={color} onChange={(e) => setColor(e.target.value)} className="input" required>
                                        <option value="">Seleccionar</option>
                                        {colors.map((c) => (
                                            <option key={c.id} value={c.id}>{c.nombre}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Talle</label>
                                    <select value={talle} onChange={(e) => setTalle(e.target.value)} className="input" required>
                                        <option value="">Seleccionar</option>
                                        {sizes.map((s) => (
                                            <option key={s.id} value={s.id}>{s.numero}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png"
                                    required={!editingId}
                                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                                    className="text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {editingId
                                        ? "Opcional en edición. Si elegís una nueva, reemplaza la actual."
                                        : "Obligatoria al crear. Formatos: .jpg, .jpeg, .png"}
                                </p>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={saving} className="btn-primary flex-1">
                                    {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Crear producto"}
                                </button>
                                <button type="button" onClick={() => setShowForm(false)} className="btn-outline">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Tabla */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Producto</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Precio</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Categoría</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Color</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Talle</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Estado</th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map((product) => (
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
                                    <td className="px-6 py-4 text-sm text-gray-600">{product.cantidad}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{product.Categorie?.genero || "—"}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{product.Color?.nombre || "—"}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{product.Talle?.numero || "—"}</td>
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
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => openEdit(product)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer">
                                                <HiOutlinePencil size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(product.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer">
                                                <HiOutlineTrash size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-sm text-gray-400">
                                        No hay productos. Creá el primero.
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
