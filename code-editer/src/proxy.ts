import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Protected routes requiring authentication
  const protectedRoutes = ["/profile"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !token) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect authenticated user away from sign-in page to home
  if (token && pathname.startsWith("/sign-in")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: ["/profile/:path*", "/sign-in"],
};

