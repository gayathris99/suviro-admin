'use client'

import { useState } from 'react'
import Link from 'next/link'
import { IconMail, IconArrowLeft } from '@tabler/icons-react'
import '../login/auth.css'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }
    setLoading(true)

    // ── TEMPORARY: fake send for UI demo ──
    // Later: POST /api/forgot-password → generates a reset token,
    // saves it with 1-hr expiry, emails a reset link via Nodemailer.
    setTimeout(() => {
      setLoading(false)
      setSent(true)
    }, 600)
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-brand-name">Suviro</span>
          <span className="auth-brand-sub">Admin Portal</span>
        </div>

        {sent ? (
          <>
            <h1 className="auth-title">Check your email</h1>
            <div className="auth-success">
              If an account exists for <strong>{email}</strong>, we've sent a
              password reset link. It expires in 1 hour.
            </div>
            <Link href="/login" className="btn btn-ghost auth-submit" style={{ justifyContent: 'center' }}>
              <IconArrowLeft size={16} /> Back to sign in
            </Link>
          </>
        ) : (
          <>
            <h1 className="auth-title">Forgot password?</h1>
            <p className="auth-sub">Enter your email and we'll send you a link to reset your password.</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="auth-field">
                <label className="auth-label">Email</label>
                <div className="auth-input-wrap">
                  <IconMail size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
                {loading ? 'Sending…' : 'Send reset link'}
              </button>
            </form>

            <div className="auth-row" style={{ justifyContent: 'center', marginTop: 20, marginBottom: 0 }}>
              <Link href="/login" className="auth-link"><IconArrowLeft size={14} style={{ verticalAlign: -2 }} /> Back to sign in</Link>
            </div>
          </>
        )}
      </div>
      <p className="auth-foot">© 2026 Suviro Pharmalife Pvt. Ltd</p>
    </div>
  )
}