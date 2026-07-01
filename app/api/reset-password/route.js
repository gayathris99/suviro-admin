// ═══════════════════════════════════════════
// API: /api/reset-password
//   POST → verify token, set new password
// ═══════════════════════════════════════════

import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { sql } from '@/lib/db'

export async function POST(request) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required.' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
    }

    // Find admin with this token, not expired
    const [admin] = await sql`
      SELECT id, reset_token_expiry
      FROM admin_user
      WHERE reset_token = ${token}
    `

    if (!admin) {
      return NextResponse.json({ error: 'Invalid or expired reset link.' }, { status: 400 })
    }

    if (new Date(admin.reset_token_expiry) < new Date()) {
      return NextResponse.json({ error: 'This reset link has expired. Please request a new one.' }, { status: 400 })
    }

    // Hash new password, clear the token
    const hash = await bcrypt.hash(password, 12)
    await sql`
      UPDATE admin_user
      SET password_hash = ${hash}, reset_token = NULL, reset_token_expiry = NULL
      WHERE id = ${admin.id}
    `

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('POST /api/reset-password failed:', err)
    return NextResponse.json({ error: 'Failed to reset password. Please try again.' }, { status: 500 })
  }
}