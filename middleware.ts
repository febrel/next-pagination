import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = pathname.startsWith("/tickets");
  const isPublicAuthPage = pathname === "/" || pathname.startsWith("/register");

  const token = request.cookies.get("session")?.value;

  // Si visita login o register con sesion activa, cerrar sesion
  if (isPublicAuthPage && token) {
    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || "fallback-secret-change-in-production",
      );
      await jwtVerify(token, secret);

      const response = NextResponse.next();
      response.cookies.set("session", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
        path: "/",
      });
      return response;
    } catch {
      // token invalido, continuar normal
    }
  }

  // Proteger rutas de tickets
  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    try {
      const secret = new TextEncoder().encode(
        process.env.JWT_SECRET || "fallback-secret-change-in-production",
      );
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/register", "/register/:path*", "/tickets/:path*"],
};
