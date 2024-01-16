import { NextResponse } from "next/server";
import withAuth from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    if (!req.nextauth.token) return;
    if (
      req.nextUrl.pathname.startsWith("/createUser") &&
      req.nextauth.token.role !== "admin"
    ) {
      return NextResponse.rewrite(new URL("/denied", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/schedule", "/exercises", "/clients", "/createUser"],
};
