# Documentación del proyecto — Estado actual

> Última actualización: 2026-02-20

---

## Índice

1. [Arquitectura general](#1-arquitectura-general)
2. [Backend — API REST (Express + Sequelize)](#2-backend--api-rest-express--sequelize)
3. [Modelos de base de datos](#3-modelos-de-base-de-datos)
4. [Endpoints implementados](#4-endpoints-implementados)
5. [Autenticación (JWT + httpOnly cookies)](#5-autenticación-jwt--httponly-cookies)
6. [Middlewares](#6-middlewares)
7. [Frontend — Next.js v2 (TypeScript + Tailwind)](#7-frontend--nextjs-v2-typescript--tailwind)
8. [Frontend — Vite v1 (legacy)](#8-frontend--vite-v1-legacy)
9. [Código legacy (EJS/sessions) aún en el repo](#9-código-legacy-ejssessions-aún-en-el-repo)
10. [Resumen de estado](#10-resumen-de-estado)

---

## 1. Arquitectura general

```
sitioweb-mvc/
├── backend/             ← API REST (Express 4 + Sequelize + MySQL)
│   ├── app.js           ← Solo rutas /api/*, sin vistas EJS
│   ├── docker-compose.yml
│   ├── src/
│   │   ├── controllers/api/   ← Todos los controllers devuelven JSON
│   │   ├── routes/api/        ← Rutas REST bajo /api
│   │   ├── middlewares/       ← authJwt, validator, log (legacy)
│   │   ├── database/models/   ← Sequelize models
│   │   └── routes/            ← Rutas EJS legacy (aún en el repo, no montadas en app.js)
│   └── public/images/
│
├── frontend/
│   ├── front-eccomerce-v2/    ← ✅ Frontend activo (Next.js 16 + TypeScript + Tailwind 4)
│   └── eccomerce-front/       ← ⚠️ Frontend viejo (Vite + React 18, admin dashboard)
│
└── doc.md
```

**Puertos:**

| Servicio | Puerto |
|---|---|
| Backend (Express) | `3001` |
| Frontend (Next.js) | `3000` |
| MySQL (Docker) | `3306` |

---

## 2. Backend — API REST (Express + Sequelize)

### `app.js` — Configuración actual

El `app.js` ya fue **completamente migrado a API REST**. No monta ninguna ruta EJS ni usa `express-session`. Solo registra rutas bajo `/api`:

```
app.use('/api/auth',     authRoutes);       → authController
app.use('/api/products', productApiRoutes); → productApiController
app.use('/api',          catalogRoutes);    → catalogController (categories, colors, sizes)
app.use('/api/cart',     cartApiRoutes);    → cartApiController
```

**Middlewares globales activos:**

- `morgan('dev')` — logging HTTP
- `express.json()` + `express.urlencoded()` — body parsing
- `cookie-parser` — lectura de cookies (JWT)
- `cors({ origin: 'http://localhost:3000', credentials: true })` — permite cookies cross-origin al frontend Next.js
- `express.static('public')` — archivos estáticos (imágenes de productos)

**Error handler:** siempre devuelve JSON `{ ok: false, message }`.

### Dependencias instaladas

| Paquete | Uso |
|---|---|
| `express` | Framework web |
| `sequelize` + `mysql2` | ORM + driver MySQL |
| `jsonwebtoken` | ✅ Ya instalado — generación/verificación JWT |
| `bcryptjs` | Hash de contraseñas |
| `multer` | Upload de imágenes (disk storage) |
| `cors` | CORS con credentials |
| `cookie-parser` | Lectura de cookies |
| `express-validator` | Validaciones de body |
| `dotenv` | Variables de entorno |
| `cloudinary` + `multer-storage-cloudinary` | Cloudinary (config legacy en `routes/product.js`, no usado en API nueva) |
| `express-session` | ⚠️ Aún en package.json pero **no usado** en `app.js` actual |
| `ejs` | ⚠️ Aún en package.json pero **no usado** en `app.js` actual |

---

## 3. Modelos de base de datos

| Modelo | Tabla | Campos | Asociaciones |
|---|---|---|---|
| `Product` | `productos` | `id`, `nombre`, `precio` (DECIMAL 10,2), `cantidad`, `id_categoria`, `id_color`, `id_talle`, `image`, `status` (ENUM: activo/descontinuado) | belongsTo Categorie, Color, Talle · belongsToMany User (through `producto_user`) |
| `User` | `usuarios` | `id`, `nombre`, `apellido`, `direccion`, `email`, `pw_hash` | belongsToMany Product (through `producto_user`) |
| `Categorie` | `categorias` | `id`, `genero` | hasMany Product |
| `Color` | `colores` | `id`, `nombre` | hasMany Product |
| `Talle` | `talles` | `id`, `numero` (INTEGER) | hasMany Product |
| `CartItem` | `cart_items` | `id`, `id_user`, `id_producto`, `quantity` (default 1) | belongsTo User, belongsTo Product |

- **Timestamps**: Product, User, Color, Talle, CartItem usan `created_at`, `updated_at`, `deleted_at` (paranoid/soft-delete).
- **Categorie**: `timestamps: false`.
- **Sequelize config global** (`config.js`): `underscored: true`, `paranoid: true`.
- **Tabla pivot** `producto_user`: relaciona productos con el usuario que los creó.

---

## 4. Endpoints implementados

### Auth (`/api/auth`) — ✅ Todos implementados

| # | Método | Ruta | Auth | Body / Params | Respuesta JSON | Estado |
|---|---|---|---|---|---|---|
| 1 | `POST` | `/api/auth/register` | No | `{ nombre, apellido, direccion, email, password }` | `{ ok, user: { id, nombre, email } }` | ✅ Listo |
| 2 | `POST` | `/api/auth/login` | No | `{ email, password }` | `{ ok, user: { id, nombre, apellido, email } }` + cookie `token` httpOnly (7d) | ✅ Listo |
| 3 | `POST` | `/api/auth/logout` | No* | — | `{ ok, message: "Sesión cerrada" }` | ✅ Listo |
| 4 | `GET` | `/api/auth/me` | Sí | — | `{ ok, user: { id, nombre, apellido, email, direccion } }` | ✅ Listo |

*Nota: logout no tiene middleware `authJwt`, simplemente limpia la cookie.

### Productos (`/api/products`) — ✅ Todos implementados

| # | Método | Ruta | Auth | Descripción | Estado |
|---|---|---|---|---|---|
| 5 | `GET` | `/api/products` | No | Listar productos con filtros (`?categoria=1&color=2&talle=3&page=1&limit=10`) y paginación. Responde `{ metadata: { status, total, page, limit, totalPages }, results: [...] }` | ✅ Listo |
| 6 | `GET` | `/api/products/last` | No | Último producto creado. Responde `{ ok, product }` | ✅ Listo |
| 7 | `GET` | `/api/products/:id` | No | Detalle de un producto con Categorie, Color, Talle. Responde `{ ok, product }` | ✅ Listo |
| 8 | `POST` | `/api/products` | Sí | Crear producto (`multipart/form-data`). Usa `validator.product` + `multer` upload. Asocia al usuario creador via `producto_user`. Responde `{ ok, product }` | ✅ Listo |
| 9 | `PUT` | `/api/products/:id` | Sí | Editar producto (`multipart/form-data`). Actualiza y re-asocia usuario. Responde `{ ok, product }` | ✅ Listo |
| 10 | `DELETE` | `/api/products/:id` | Sí | Soft-delete (cambia status a "descontinuado" + `destroy()` paranoid). Responde `{ ok, message }` | ✅ Listo |

### Catálogo auxiliar (`/api`) — ✅ Todos implementados

| # | Método | Ruta | Auth | Respuesta | Estado |
|---|---|---|---|---|---|
| 11 | `GET` | `/api/categories` | No | `{ ok, results: [{ id, genero }] }` | ✅ Listo |
| 12 | `GET` | `/api/colors` | No | `{ ok, results: [{ id, nombre }] }` | ✅ Listo |
| 13 | `GET` | `/api/sizes` | No | `{ ok, results: [{ id, numero }] }` | ✅ Listo |

### Carrito (`/api/cart`) — ✅ Todos implementados (migrado a DB con modelo `CartItem`)

| # | Método | Ruta | Auth | Body / Params | Respuesta JSON | Estado |
|---|---|---|---|---|---|---|
| 14 | `GET` | `/api/cart` | Sí | — | `{ ok, items: [{ productId, nombre, precio, quantity, image, subtotal }], total }` | ✅ Listo |
| 15 | `POST` | `/api/cart` | Sí | `{ productId, quantity }` | `{ ok, items: [...], total }` | ✅ Listo |
| 16 | `PUT` | `/api/cart/:productId` | Sí | `{ quantity }` | `{ ok, items: [...], total }` | ✅ Listo |
| 17 | `DELETE` | `/api/cart/:productId` | Sí | — | `{ ok, items: [...], total }` | ✅ Listo |
| 18 | `DELETE` | `/api/cart` | Sí | — | `{ ok, message: "Carrito vaciado" }` | ✅ Listo |

Todas las rutas del carrito pasan por `authJwt` (middleware a nivel de router). El carrito se persiste en la tabla `cart_items` asociado al `id_user` del JWT.

### Rutas legacy (no montadas en app.js pero aún en el código)

| Archivo | Ruta base original | Nota |
|---|---|---|
| `routes/api/apiRoutes.js` | `/api` | **viejo** controller (`apiController.js`). Tiene `/api/products`, `/api/products/last`, `/api/categories`, `/api/colores`, `/api/users`. Ya reemplazado por `productRoutes.js` + `catalogRoutes.js`. **No montado en `app.js`**. |
| `routes/index.js` | `/` | Landing EJS. **No montado en `app.js`**. |
| `routes/product.js` | `/products` | CRUD EJS con renders y redirects. **No montado en `app.js`**. |
| `routes/users.js` | `/users` | Auth EJS con renders y redirects. **No montado en `app.js`**. |
| `routes/cartRoutes.js` | `/cart` | Carrito basado en `req.session`. **No montado en `app.js`**. |

---

## 5. Autenticación (JWT + httpOnly cookies)

### ✅ Estado: Completamente implementado

```
Login  →  bcrypt.compareSync  →  jwt.sign({ id, nombre, email }, JWT_SECRET, 7d)
       →  res.cookie('token', jwt, { httpOnly, sameSite: 'lax', secure: false, maxAge: 7d })

Cada request protegido  →  authJwt middleware lee req.cookies.token
                        →  jwt.verify()  →  inyecta req.user = { id, nombre, email }

Logout  →  res.clearCookie('token')
```

**Archivo:** `src/middlewares/authJwt.js`
**Variable de entorno:** `JWT_SECRET` (definido en `.env`, ejemplo en `.env.example`)

### Carrito: migrado de sesión a DB

El carrito ya **no depende de `req.session`**. Se usa el modelo `CartItem` (tabla `cart_items`) con `id_user` e `id_producto`. Todas las operaciones del carrito requieren JWT válido.

---

## 6. Middlewares

| Middleware | Archivo | Uso actual |
|---|---|---|
| `authJwt` | `middlewares/authJwt.js` | ✅ Activo — protege rutas que requieren autenticación (productos CRUD, carrito) |
| `validator` | `middlewares/validator.js` | ✅ Activo — validaciones `express-validator` para `product` (nombre, precio, cantidad) y `login` (email, password) |
| `log` | `middlewares/log.js` | ⚠️ Legacy — lee `req.session.usuario` y `req.cookies.recordarme`. **No montado en `app.js` actual** pero sigue en el código |

---

## 7. Frontend — Next.js v2 (TypeScript + Tailwind)

**Directorio:** `frontend/front-eccomerce-v2/`
**Stack:** Next.js 16.1.6 · React 19 · TypeScript · Tailwind CSS 4 · Axios · Zod · react-icons

### Estructura

```
src/
├── app/
│   ├── layout.tsx          ← Layout raíz (AuthProvider > CartProvider > Navbar)
│   ├── page.tsx            ← Redirige a /productos
│   ├── productos/
│   │   ├── page.tsx        ← Listado con filtros + paginación
│   │   └── [id]/page.tsx   ← Detalle de producto + agregar al carrito
│   ├── carrito/page.tsx    ← Vista del carrito (requiere auth)
│   ├── login/page.tsx      ← Formulario login (validación Zod)
│   └── register/page.tsx   ← Formulario registro (validación Zod)
├── components/
│   ├── Navbar.tsx          ← Navbar responsiva con menú mobile
│   ├── ProductCard.tsx     ← Card de producto para la grilla
│   ├── FilterSidebar.tsx   ← Sidebar de filtros (categoría, color, talle) + drawer mobile
│   └── CartItemRow.tsx     ← Fila de item en el carrito con controles de cantidad
├── context/
│   ├── AuthContext.tsx     ← Provider de auth (login, register, logout, me)
│   └── CartContext.tsx     ← Provider de carrito (CRUD contra /api/cart)
├── lib/
│   └── http.ts             ← Instancia Axios (baseURL: http://localhost:3001/api, withCredentials)
├── types/
│   └── index.ts            ← Interfaces TS (User, Product, CartItem, respuestas API, filtros)
└── middleware.ts            ← Next.js middleware: protege /carrito (redirige a /login), bloquea /login y /register si ya autenticado
```

### Páginas implementadas

| Ruta | Componente | Funcionalidad | Estado |
|---|---|---|---|
| `/` | `page.tsx` | Redirect a `/productos` | ✅ |
| `/productos` | `productos/page.tsx` | Listado de productos con filtros (categoría, color, talle), paginación, skeleton loading, estado vacío | ✅ |
| `/productos/:id` | `productos/[id]/page.tsx` | Detalle con imagen, atributos, selector de cantidad, botón "Agregar al carrito" con feedback visual | ✅ |
| `/carrito` | `carrito/page.tsx` | Vista del carrito: lista de items, controles +/−, eliminar, vaciar, resumen con total, botón "Finalizar compra" | ✅ |
| `/login` | `login/page.tsx` | Formulario login con validación Zod, errores inline, error del servidor, redirige a `/productos` tras login | ✅ |
| `/register` | `register/page.tsx` | Formulario registro (nombre, apellido, dirección, email, password, confirmar password), validación Zod, redirige a `/login` | ✅ |

### Contexts

- **`AuthContext`**: al montar llama `GET /api/auth/me` para restaurar sesión. Expone `user`, `loading`, `login()`, `register()`, `logout()`.
- **`CartContext`**: expone `items`, `total`, `itemCount`, `fetchCart()`, `addToCart()`, `updateQuantity()`, `removeFromCart()`, `clearCart()`. Todas las operaciones van contra la API `/api/cart`.

### Middleware Next.js

- Rutas protegidas: `/carrito` → si no hay cookie `token`, redirige a `/login?from=/carrito`
- Rutas solo-invitado: `/login`, `/register` → si hay cookie `token`, redirige a `/productos`

### Configuración Next.js

- `next.config.ts`: permite imágenes remotas desde `http://localhost:3001/images/**`

---

## 8. Frontend — Vite v1 (legacy)

**Directorio:** `frontend/eccomerce-front/`
**Stack:** Vite 5 · React 18 · react-router-dom 6

Es un dashboard/admin anterior. Tiene 16 componentes y un custom hook `useFetch`. **No está conectado al backend actual** (no usa JWT ni las rutas nuevas). Se puede considerar legacy/deprecated.

---

## 9. Código legacy (EJS/sessions) aún en el repo

Los siguientes archivos todavía existen en el backend pero **ninguno está montado** en el `app.js` actual:

| Archivo | Descripción |
|---|---|
| `controllers/api/apiController.js` | API vieja (formato de respuesta distinto: `{ metadata, resultados }` en vez de `{ ok, results }`) |
| `controllers/api/userApiController.js` | `GET /api/users` — listado de usuarios (formato viejo) |
| `routes/index.js` | Ruta EJS `GET /` |
| `routes/product.js` | Rutas EJS de productos (renders + redirects) |
| `routes/users.js` | Rutas EJS de auth (renders + redirects) |
| `routes/cartRoutes.js` | Carrito basado en `req.session` |
| `routes/api/apiRoutes.js` | Rutas API viejas |
| `middlewares/log.js` | Middleware de sesión/cookie `recordarme` |
| `views/` (11 archivos) | Templates EJS |
| `package.json`: `ejs`, `express-session` | Dependencias ya no usadas |

> **Recomendación:** estos archivos pueden eliminarse o moverse a una rama `legacy` para limpiar el proyecto.

---

## 10. Resumen de estado

### ✅ Completado

| Tarea | Detalle |
|---|---|
| API REST completa bajo `/api/` | 18 endpoints implementados, todos devuelven JSON |
| Autenticación JWT + httpOnly cookie | `authJwt.js` middleware + `authController.js` (register, login, logout, me) |
| `jsonwebtoken` instalado y configurado | En `package.json` y usado en auth controller + middleware |
| Middleware `authJwt.js` creado | Lee cookie `token`, verifica JWT, inyecta `req.user` |
| Carrito migrado de sesión a DB | Modelo `CartItem` (tabla `cart_items`), 5 endpoints CRUD, todo vía JWT |
| Endpoint `GET /api/products/:id` | Con includes de Categorie, Color, Talle |
| Filtros por query params | `?categoria=1&color=2&talle=3&page=1&limit=10` con paginación |
| Endpoint `GET /api/sizes` | Devuelve talles con formato `{ ok, results }` |
| Rutas unificadas bajo `/api/` | `app.js` solo monta rutas `/api/*` |
| Frontend Next.js completo | 6 páginas, 4 componentes, 2 contexts, middleware, types |
| Validación client-side con Zod | Login y registro con errores inline |
| CORS configurado | `credentials: true`, origin `http://localhost:3000` |
| Docker Compose para MySQL | Container `eccomerce_db` con init SQL |

### ⚠️ Pendiente / Mejoras sugeridas

| Tarea | Prioridad | Nota |
|---|---|---|
| Eliminar código legacy (EJS, sessions, rutas viejas) | Baja | No afecta funcionamiento, pero ensucia el repo |
| Quitar `ejs` y `express-session` de `package.json` | Baja | Ya no se usan |
| Página de creación/edición de productos en Next.js | Media | El backend ya tiene los endpoints `POST` y `PUT`, falta la UI admin |
| `secure: true` en cookie JWT para producción | Alta (deploy) | Actualmente `secure: false` para desarrollo local |
| Listado de usuarios (`GET /api/users`) | Baja | El endpoint viejo existe pero con formato inconsistente; falta decidir si se necesita |
| Checkout / pagos | Media | Botón "Finalizar compra" en el frontend no tiene lógica implementada |
| Cloudinary en API nueva | Baja | Las rutas nuevas usan `multer` disk storage; Cloudinary solo está configurado en el `routes/product.js` legacy |
| Tests | Media | No hay tests unitarios ni de integración |
| Variables de entorno de producción | Alta (deploy) | `config.js` tiene sección `production` preparada con SSL |
