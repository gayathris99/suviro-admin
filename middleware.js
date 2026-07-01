import { NextResponse } from 'next/server'

// Routes that require being "logged in"
const PROTECTED = ['/categories', '/products']

// Routes only for logged-OUT users (redirect away if already in)
const AUTH_PAGES = ['/login', '/forgot-password', '/reset-password']

export function middleware(request) {
  const { pathname } = request.nextUrl
  const isLoggedIn = request.cookies.get('suviro_admin_session')?.value === 'active'

  // Trying to open a protected page without a session → login
  if (PROTECTED.some((p) => pathname.startsWith(p)) && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Already logged in but visiting login → send to categories
  if (AUTH_PAGES.some((p) => pathname.startsWith(p)) && isLoggedIn) {
    return NextResponse.redirect(new URL('/categories', request.url))
  }

  return NextResponse.next()
}

// Only run middleware on these routes
export const config = {
  matcher: ['/categories/:path*', '/products/:path*', '/login', '/forgot-password', '/reset-password'],
}