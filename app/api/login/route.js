// ═══════════════════════════════════════════
// API: /api/login
//   POST → verify credentials, set JWT session cookie
// ═══════════════════════════════════════════

import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { sql } from '@/lib/db'
import { signSession, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/auth'

export async function POST(request) {
  try {
    const { email, password } = await request.json()

    if (!email?.trim() || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    }

    // look up the admin
    const [admin] = await sql`
      SELECT id, email, password_hash
      FROM admin_user
      WHERE email = ${email.trim().toLowerCase()}
    `

    // generic error message either way (don't reveal which part was wrong)
    if (!admin) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, admin.password_hash)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
    }

    // issue JWT
    const token = await signSession({ sub: admin.id, email: admin.email })

    const res = NextResponse.json({ success: true })
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE,
    })
    return res
  } catch (err) {
    console.error('POST /api/login failed:', err)
    return NextResponse.json({ error: 'Login failed. Please try again.' }, { status: 500 })
  }
}