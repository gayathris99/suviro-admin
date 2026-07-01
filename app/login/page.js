'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { IconMail, IconLock, IconEye, IconEyeOff } from '@tabler/icons-react'
import './auth.css'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password) {
      setError('Please enter your email and password.')
      return
    }

    setLoading(true)

    // ── TEMPORARY: fake login for UI demo ──
    // Sets a dummy session cookie so middleware lets us into
    // protected pages. Later this becomes a POST to /api/login
    // that verifies the password (bcrypt) and sets a JWT cookie.
    setTimeout(() => {
      document.cookie = 'suviro_admin_session=active; path=/; max-age=1800' // 30 min
      setLoading(false)
      router.push('/categories')
      router.refresh()
    }, 500)
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-brand-name">Suviro</span>
          <span className="auth-brand-sub">Admin Portal</span>
        </div>

        <h1 className="auth-title">Sign in</h1>
        <p className="auth-sub">Enter your credentials to manage products and categories.</p>

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

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <div className="auth-input-wrap">
              <IconLock size={18} />
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="auth-eye"
                onClick={() => setShowPw((s) => !s)}
                tabIndex={-1}
              >
                {showPw ? <IconEyeOff size={18} /> : <IconEye size={18} />}
              </button>
            </div>
          </div>

          <div className="auth-row">
            <Link href="/forgot-password" className="auth-link">Forgot password?</Link>
          </div>

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>

      <p className="auth-foot">© 2026 Suviro Pharmalife Pvt. Ltd</p>
    </div>
  )
}