'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { IconLock, IconEye, IconEyeOff, IconCircleCheck } from '@tabler/icons-react'
import '../login/auth.css'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!token) {
      setError('Invalid reset link. Please request a new one.')
      return
    }
    if (!password || !confirm) {
      setError('Please fill in both fields.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to reset password.')
        setLoading(false)
        return
      }
      setLoading(false)
      setDone(true)
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="auth-brand-name">Suviro</span>
          <span className="auth-brand-sub">Admin Portal</span>
        </div>

        {done ? (
          <>
            <div style={{ color: '#16a34a', marginBottom: 14 }}><IconCircleCheck size={40} /></div>
            <h1 className="auth-title">Password updated</h1>
            <p className="auth-sub">Your password has been changed successfully.</p>
            <button className="btn btn-primary auth-submit" onClick={() => router.push('/login')}>
              Go to sign in
            </button>
          </>
        ) : !token ? (
          <>
            <h1 className="auth-title">Invalid link</h1>
            <p className="auth-sub">This reset link is invalid or missing. Please request a new one.</p>
            <Link href="/forgot-password" className="btn btn-primary auth-submit" style={{ justifyContent: 'center' }}>
              Request new link
            </Link>
          </>
        ) : (
          <>
            <h1 className="auth-title">Set a new password</h1>
            <p className="auth-sub">Choose a strong password you haven't used before.</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="auth-field">
                <label className="auth-label">New password</label>
                <div className="auth-input-wrap">
                  <IconLock size={18} />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    autoComplete="new-password"
                  />
                  <button type="button" className="auth-eye" onClick={() => setShowPw((s) => !s)} tabIndex={-1}>
                    {showPw ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                  </button>
                </div>
              </div>

              <div className="auth-field">
                <label className="auth-label">Confirm password</label>
                <div className="auth-input-wrap">
                  <IconLock size={18} />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="Re-enter password"
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
                {loading ? 'Updating…' : 'Update password'}
              </button>
            </form>

            <div className="auth-row" style={{ justifyContent: 'center', marginTop: 20, marginBottom: 0 }}>
              <Link href="/login" className="auth-link">Back to sign in</Link>
            </div>
          </>
        )}
      </div>
      <p className="auth-foot">© 2026 Suviro Pharmalife Pvt. Ltd</p>
    </div>
  )
}