// ═══════════════════════════════════════════
// AUTH HELPERS — JWT sign & verify (jose)
// Works in both Node and Edge (middleware) runtimes.
// ═══════════════════════════════════════════

import { SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET)
const ALG = 'HS256'

// 30-minute session
export const SESSION_MAX_AGE = 30 * 60 // seconds

// Create a signed JWT for a logged-in admin
export async function signSession(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secret)
}

// Verify a JWT — returns the payload or null if invalid/expired
export async function verifySession(token) {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch {
    return null
  }
}

export const SESSION_COOKIE = 'suviro_session'