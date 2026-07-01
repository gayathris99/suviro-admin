// ═══════════════════════════════════════════
// API: /api/forgot-password
//   POST → generate reset token, email reset link
// ═══════════════════════════════════════════

import { NextResponse } from 'next/server'
import crypto from 'crypto'
import nodemailer from 'nodemailer'
import { sql } from '@/lib/db'

export async function POST(request) {
  try {
    const { email } = await request.json()
    const cleanEmail = email?.trim().toLowerCase()

    if (!cleanEmail) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
    }

    // Look up admin
    const [admin] = await sql`SELECT id, email FROM admin_user WHERE email = ${cleanEmail}`

    // Always return success (don't reveal whether the email exists).
    // Only actually send if the admin exists.
    if (admin) {
      const token = crypto.randomBytes(32).toString('hex')
      const expiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

      await sql`
        UPDATE admin_user
        SET reset_token = ${token}, reset_token_expiry = ${expiry.toISOString()}
        WHERE id = ${admin.id}
      `

      const baseUrl = process.env.APP_URL || 'http://localhost:3001'
      const resetLink = `${baseUrl}/reset-password?token=${token}`

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
      })

      await transporter.sendMail({
        from: `"Suviro Admin" <${process.env.GMAIL_USER}>`,
        to: admin.email,
        subject: 'Reset your Suviro Admin password',
        html: `
          <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto;">
            <h2 style="color: #0b1e3c;">Password reset request</h2>
            <p>We received a request to reset your Suviro Admin password. Click the button below to choose a new one. This link expires in 1 hour.</p>
            <p style="margin: 28px 0;">
              <a href="${resetLink}" style="background: #0b1e3c; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 500;">Reset Password</a>
            </p>
            <p style="color: #6b7280; font-size: 13px;">If you didn't request this, you can safely ignore this email — your password won't change.</p>
            <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">Or paste this link into your browser:<br>${resetLink}</p>
          </div>
        `,
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('POST /api/forgot-password failed:', err)
    return NextResponse.json({ error: 'Failed to send reset email. Please try again.' }, { status: 500 })
  }
}