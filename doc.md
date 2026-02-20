# Análisis completo del backend para migración a Next.js

## 1. Rutas que devuelven vistas EJS (hay que convertir a JSON)

| Ruta actual | Método | Controller | Qué hace | Devuelve |
|---|---|---|---|---|
| `GET /` | GET | `indexController.index` | Lista productos | `res.render('index')` |
| `GET /products` | GET | `productController.showProduct` | Lista productos | `res.render('index')` |
| `GET /products/detail/:id` | GET | `productController.detail` | Detalle producto | `res.render('productDetail')` |
| `GET /products/create` | GET | `productController.create` | Form crear producto | `res.render('product-create-form')` |
| `GET /products/detail/edit/:id` | GET | `productController.edit` | Form editar producto | `res.render('productEdit')` |
| `PUT /products/detail/:id/update` | PUT | `productController.update` | Actualiza producto | `res.redirect('/')` |
| `POST /products/store` | POST | `productController.store` | Crea producto | `res.redirect('/products')` |
| `DELETE /products/detail/:id/delete` | DELETE | `productController.delete` | Soft-delete producto | `res.redirect('/')` |
| `GET /users/register` | GET | `userController.showRegister` | Form registro | `res.render('register')` |
| `POST /users/register` | POST | `userController.createNewUser` | Crea usuario | `res.redirect('/users/login')` |
| `GET /users/login` | GET | `userController.showLogin` | Form login | `res.render('login')` |
| `POST /users/login` | POST | `userController.login` | Autentica | `res.redirect('/')` |
| `GET /users/logout` | GET | `userController.logout` | Cierra sesión | `res.redirect('/products')` |
| `GET /cart` | GET | `cartController.viewCart` | Ver carrito | `res.render('cart')` |

**Todas estas rutas necesitan refactorizarse** para devolver JSON en lugar de renders/redirects.

---

## 2. Rutas que YA funcionan como API (devuelven JSON)

| Ruta | Método | Controller | Respuesta |
|---|---|---|---|
| `GET /api/products` | GET | `apiController.index` | JSON con todos los productos |
| `GET /api/products/last` | GET | `apiController.getLastProduct` | JSON con último producto |
| `GET /api/categories` | GET | `apiController.getCategories` | JSON con categorías |
| `GET /api/colores` | GET | `apiController.getColors` | JSON con colores |
| `GET /api/users` | GET | `userApiController.getUsers` | JSON con usuarios |
| `POST /cart/add/:id` | POST | `cartController.addToCart` | JSON `{ message, cart }` |
| `POST /cart/remove/:id` | POST | `cartController.removeFromCart` | JSON `{ message, cart }` |
| `POST /cart/clear` | POST | `cartController.clearCart` | JSON `{ message }` |

**Nota:** Las rutas del carrito devuelven JSON pero dependen de `req.session`, lo cual hay que migrar.

---

## 3. Autenticación: de `express-session` a JWT + httpOnly cookies

### Estado actual

- Usa `express-session` para guardar `req.session.usuario` (objeto completo del usuario)
- Cookie `recordarme` con el email en texto plano (inseguro)
- El middleware `log.js` inyecta `res.locals.usuario` para las vistas EJS
- El carrito también vive en `req.session.cart`

### Cómo debe quedar con JWT

```
Login  →  Valida credenciales  →  Genera JWT  →  Lo setea como cookie httpOnly
Cada request  →  Middleware lee la cookie  →  Verifica JWT  →  Inyecta req.user
Logout  →  Limpia la cookie
```

Cambios necesarios:

- **Login:** en vez de `req.session.usuario = user`, generar un JWT con `{ id, email, nombre }` y setearlo con `res.cookie('token', jwt, { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 7*24*60*60*1000 })`
- **Middleware auth:** en vez de leer `req.session`, leer `req.cookies.token`, verificar con `jwt.verify()` e inyectar `req.user`
- **Logout:** `res.clearCookie('token')`
- **Carrito:** debe moverse a la base de datos (tabla `producto_user` que ya existe) o a una tabla `cart_items` nueva, ya que sin sesiones no hay dónde guardar el carrito en el servidor. Alternativamente, se puede manejar el carrito en el **state de Next.js** (localStorage + Context/Zustand) y solo persistirlo al hacer checkout.

---

## 4. Endpoints que necesita el frontend Next.js

### Auth

| Endpoint | Método | Descripción |
|---|---|---|
| `POST /api/auth/register` | POST | Registrar usuario |
| `POST /api/auth/login` | POST | Login, setea cookie JWT |
| `POST /api/auth/logout` | POST | Limpia cookie JWT |
| `GET /api/auth/me` | GET | Devuelve usuario actual (lee JWT) |

### Catálogo

| Endpoint | Método | Descripción |
|---|---|---|
| `GET /api/products` | GET | Listar productos (ya existe) |
| `GET /api/products/:id` | GET | Detalle de un producto |
| `GET /api/products?categoria=X&color=Y` | GET | Filtrar productos |
| `GET /api/categories` | GET | Listar categorías (ya existe) |
| `GET /api/colors` | GET | Listar colores (ya existe) |
| `GET /api/sizes` | GET | Listar talles |
| `POST /api/products` | POST | Crear producto (auth requerida) |
| `PUT /api/products/:id` | PUT | Editar producto (auth requerida) |
| `DELETE /api/products/:id` | DELETE | Eliminar producto (auth requerida) |

### Carrito

| Endpoint | Método | Descripción |
|---|---|---|
| `GET /api/cart` | GET | Obtener carrito del usuario |
| `POST /api/cart` | POST | Agregar producto al carrito |
| `PUT /api/cart/:productId` | PUT | Actualizar cantidad |
| `DELETE /api/cart/:productId` | DELETE | Quitar producto del carrito |
| `DELETE /api/cart` | DELETE | Vaciar carrito |

---

## 5. Lista final de endpoints REST

### Auth

| # | Método | Ruta | Auth | Body / Params | Respuesta JSON |
|---|---|---|---|---|---|
| 1 | `POST` | `/api/auth/register` | No | `{ nombre, apellido, direccion, email, password }` | `{ ok: true, user: { id, nombre, email } }` |
| 2 | `POST` | `/api/auth/login` | No | `{ email, password }` | `{ ok: true, user: { id, nombre, email } }` + cookie `token` |
| 3 | `POST` | `/api/auth/logout` | Sí | — | `{ ok: true, message: "Sesión cerrada" }` |
| 4 | `GET` | `/api/auth/me` | Sí | — | `{ ok: true, user: { id, nombre, apellido, email, direccion } }` |

### Productos

| # | Método | Ruta | Auth | Body / Params | Respuesta JSON |
|---|---|---|---|---|---|
| 5 | `GET` | `/api/products` | No | Query: `?categoria=1&color=2&talle=3&page=1&limit=10` | `{ metadata: { status, total, page, limit }, results: [...] }` |
| 6 | `GET` | `/api/products/:id` | No | Param: `id` | `{ ok: true, product: { id, nombre, precio, cantidad, Categorie, Color, Talle, image, status } }` |
| 7 | `POST` | `/api/products` | Sí | `multipart/form-data`: `{ nombre, precio, cantidad, categoria, color, talle, image }` | `{ ok: true, product: { ... } }` |
| 8 | `PUT` | `/api/products/:id` | Sí | `multipart/form-data`: `{ nombre, precio, cantidad, categoria, color, talle, image? }` | `{ ok: true, product: { ... } }` |
| 9 | `DELETE` | `/api/products/:id` | Sí | Param: `id` | `{ ok: true, message: "Producto eliminado" }` |

### Catálogo (auxiliares)

| # | Método | Ruta | Auth | Body / Params | Respuesta JSON |
|---|---|---|---|---|---|
| 10 | `GET` | `/api/categories` | No | — | `{ ok: true, results: [{ id, genero }] }` |
| 11 | `GET` | `/api/colors` | No | — | `{ ok: true, results: [{ id, nombre }] }` |
| 12 | `GET` | `/api/sizes` | No | — | `{ ok: true, results: [{ id, numero }] }` |

### Carrito

| # | Método | Ruta | Auth | Body / Params | Respuesta JSON |
|---|---|---|---|---|---|
| 13 | `GET` | `/api/cart` | Sí | — | `{ ok: true, items: [{ productId, nombre, precio, quantity }], total: 6000 }` |
| 14 | `POST` | `/api/cart` | Sí | `{ productId: 1, quantity: 1 }` | `{ ok: true, items: [...], total }` |
| 15 | `PUT` | `/api/cart/:productId` | Sí | `{ quantity: 3 }` | `{ ok: true, items: [...], total }` |
| 16 | `DELETE` | `/api/cart/:productId` | Sí | Param: `productId` | `{ ok: true, items: [...], total }` |
| 17 | `DELETE` | `/api/cart` | Sí | — | `{ ok: true, message: "Carrito vaciado" }` |

---

## Resumen de trabajo pendiente

| Tarea | Estado |
|---|---|
| Rutas API que ya devuelven JSON | 5 de 17 listas (`GET /api/products`, `GET /api/products/last`, `GET /api/categories`, `GET /api/colors`, `GET /api/users`) |
| Rutas EJS que hay que convertir | 14 rutas (todo lo de products/, users/, cart/, index) |
| Instalar `jsonwebtoken` | Pendiente |
| Crear middleware `authJwt.js` | Pendiente |
| Migrar carrito de sesión a DB o client-side | Pendiente |
| Unificar todas las rutas bajo `/api/` | Pendiente |
| Agregar endpoint `GET /api/products/:id` | Pendiente |
| Agregar filtros por query params | Pendiente |
| Agregar endpoint `GET /api/sizes` | Pendiente |
