import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl } = req
  const isAuthenticated = !!req.auth

  // Define public routes that don't require authentication
  const isPublicRoute = nextUrl.pathname === "/" || nextUrl.pathname === "/login"
  
  // Define protected routes that require authentication
  const isProtectedRoute = nextUrl.pathname.startsWith("/dashboard")

  // Allow access to public routes
  if (isPublicRoute) {
    // If user is authenticated and trying to access login, redirect to dashboard
    if (isAuthenticated && nextUrl.pathname === "/login") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl))
    }
    return NextResponse.next()
  }

  // Protect dashboard routes
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", nextUrl)
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
}