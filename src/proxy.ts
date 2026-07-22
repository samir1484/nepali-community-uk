import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  if (!isAdminRoute) return NextResponse.next();

  const role = req.auth?.user?.role;
  if (role !== "ADMIN" && role !== "MODERATOR") {
    const signInUrl = new URL("/login", req.nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
