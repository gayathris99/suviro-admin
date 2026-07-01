// ═══════════════════════════════════════════
// MIDDLEWARE — protects admin routes with real JWT
// Verifies the session cookie; slides expiry on activity.
// ═══════════════════════════════════════════

import { NextResponse } from 'next/server'
import { verifySession, signSession, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/auth'

const PROTECTED = ['/categories', '/products']
const AUTH_PAGES = ['/login', '/forgot-password', '/reset-password']

export async function middleware(request) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(SESSION_COOKIE)?.value
  const session = await verifySession(token)
  const isLoggedIn = !!session

  // Protected page without a valid session → login
  if (PROTECTED.some((p) => pathname.startsWith(p)) && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Already logged in but on an auth page → categories
  if (AUTH_PAGES.some((p) => pathname.startsWith(p)) && isLoggedIn) {
    return NextResponse.redirect(new URL('/categories', request.url))
  }

  // Sliding expiry: on activity in a protected area, re-issue a fresh token
  // so the 30-min window resets while the admin is active.
  if (isLoggedIn && PROTECTED.some((p) => pathname.startsWith(p))) {
    const fresh = await signSession({ sub: session.sub, email: session.email })
    const res = NextResponse.next()
    res.cookies.set(SESSION_COOKIE, fresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE,
    })
    return res
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/categories/:path*', '/products/:path*', '/login', '/forgot-password', '/reset-password'],
}