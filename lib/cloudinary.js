// ═══════════════════════════════════════════
// CLOUDINARY UPLOAD HELPER (browser, unsigned)
// ───────────────────────────────────────────
// Uploads a File to Cloudinary using the unsigned preset
// and returns the secure URL of the hosted image.
// ═══════════════════════════════════════════

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

export async function uploadToCloudinary(file) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Cloudinary env vars are missing. Check .env.local')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  )

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || 'Cloudinary upload failed')
  }

  const data = await res.json()
  return data.secure_url // the hosted https URL to store in the DB
}