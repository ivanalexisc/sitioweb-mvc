"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { AxiosError } from "axios";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

type FieldErrors = Partial<Record<keyof z.infer<typeof loginSchema>, string>>;

export default function LoginPage() {
  const { login } = useAuth();
  const { fetchCart } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: undefined });
    setApiError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    // Validación con Zod
    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const errors: FieldErrors = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof FieldErrors;
        if (!errors[key]) errors[key] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      await login(form.email, form.password);
      await fetchCart();
      router.push("/productos");
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        setApiError(err.response.data.message);
      } else {
        setApiError("Error al iniciar sesión");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-8">Iniciar sesión</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="input"
              placeholder="tu@email.com"
            />
            {fieldErrors.email && (
              <p className="text-xs text-[var(--danger)]">{fieldErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="input"
              placeholder="••••••••"
            />
            {fieldErrors.password && (
              <p className="text-xs text-[var(--danger)]">{fieldErrors.password}</p>
            )}
          </div>

          {/* Error del servidor */}
          {apiError && (
            <p className="text-sm text-[var(--danger)] bg-red-50 px-3 py-2 rounded-md">
              {apiError}
            </p>
          )}

          {/* Submit */}
          <button type="submit" disabled={loading} className="btn-primary mt-2">
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <p className="text-sm text-center text-[var(--muted)] mt-6">
          ¿No tenés cuenta?{" "}
          <Link href="/register" className="text-[var(--foreground)] font-medium underline">
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
}
