"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { AxiosError } from "axios";

const registerSchema = z.object({
  nombre: z.string().min(2, "Mínimo 2 caracteres"),
  apellido: z.string().min(2, "Mínimo 2 caracteres"),
  direccion: z.string().optional(),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof registerSchema>;
type FieldErrors = Partial<Record<keyof FormData, string>>;

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState<FormData>({
    nombre: "",
    apellido: "",
    direccion: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
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

    const result = registerSchema.safeParse(form);
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
      const { confirmPassword, ...payload } = form;
      await register(payload);
      router.push("/login");
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        setApiError(err.response.data.message);
      } else {
        setApiError("Error al registrar usuario");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-8">Crear cuenta</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Nombre y Apellido */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="nombre" className="text-sm font-medium">
                Nombre
              </label>
              <input
                id="nombre"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                className="input"
                placeholder="Juan"
              />
              {fieldErrors.nombre && (
                <p className="text-xs text-[var(--danger)]">{fieldErrors.nombre}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="apellido" className="text-sm font-medium">
                Apellido
              </label>
              <input
                id="apellido"
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                className="input"
                placeholder="Pérez"
              />
              {fieldErrors.apellido && (
                <p className="text-xs text-[var(--danger)]">{fieldErrors.apellido}</p>
              )}
            </div>
          </div>

          {/* Dirección */}
          <div className="flex flex-col gap-1">
            <label htmlFor="direccion" className="text-sm font-medium">
              Dirección <span className="text-[var(--muted)]">(opcional)</span>
            </label>
            <input
              id="direccion"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              className="input"
              placeholder="Av. Siempreviva 742"
            />
          </div>

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

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirmar contraseña
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="input"
              placeholder="••••••••"
            />
            {fieldErrors.confirmPassword && (
              <p className="text-xs text-[var(--danger)]">{fieldErrors.confirmPassword}</p>
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
            {loading ? "Registrando..." : "Crear cuenta"}
          </button>
        </form>

        <p className="text-sm text-center text-[var(--muted)] mt-6">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="text-[var(--foreground)] font-medium underline">
            Ingresá
          </Link>
        </p>
      </div>
    </div>
  );
}
