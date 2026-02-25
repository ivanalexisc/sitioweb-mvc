/* ---- Modelos ---- */

export interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  direccion: string | null;
  role: 'user' | 'admin';
}

export interface Categorie {
  id: number;
  genero: string;
}

export interface Color {
  id: number;
  nombre: string;
}

export interface Talle {
  id: number;
  numero: string;
}

export interface ProductImage {
  id: number;
  image: string;
  is_primary: boolean;
}

export interface Product {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
  id_categoria: number;
  id_color: number;
  id_talle: number;
  image: string | null;
  images?: ProductImage[];
  status: "activo" | "descontinuado";
  Categorie: Categorie;
  Color: Color;
  Talle: Talle;
}

export interface CartItem {
  productId: number;
  nombre: string;
  precio: number;
  quantity: number;
  image: string | null;
  subtotal: number;
}

/* ---- Respuestas de la API ---- */

export interface ApiResponse<T> {
  ok: boolean;
  message?: string;
}

export interface AuthResponse extends ApiResponse<User> {
  user: User;
}

export interface ProductListResponse {
  metadata: {
    status: number;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  results: Product[];
}

export interface ProductDetailResponse extends ApiResponse<Product> {
  product: Product;
}

export interface CatalogResponse<T> extends ApiResponse<T[]> {
  results: T[];
}

export interface CartResponse extends ApiResponse<CartItem[]> {
  items: CartItem[];
  total: number;
}

/* ---- Filtros ---- */

export interface ProductFilters {
  categoria?: number;
  color?: number;
  talle?: number;
  page?: number;
  limit?: number;
}
