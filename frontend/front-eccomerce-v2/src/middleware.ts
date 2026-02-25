import { NextResponse, type NextRequest } from "next/server";

// Rutas que requieren autenticación (cookie "token" presente)
const protectedPaths = ["/carrito", "/admin"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Rutas protegidas → redirigir a /login si no hay token
  if (protectedPaths.some((p) => pathname.startsWith(p))) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/carrito/:path*", "/admin/:path*", "/login", "/register"],
};
