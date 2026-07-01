// ═══════════════════════════════════════════
// CLOUDINARY IMAGE OPTIMIZATION
// ───────────────────────────────────────────
// Inserts transformation params into a Cloudinary URL so the
// public site serves optimized images:
//   f_auto  → best format (WebP/AVIF) for the browser
//   q_auto  → automatic quality compression
//   w_<n>   → cap the width (resized on Cloudinary's side)
//   c_limit → never upscale, only shrink if larger
// ═══════════════════════════════════════════

export function optimizeCloudinary(url, width = 800) {
    if (!url || !url.includes('/upload/')) return url
    const transform = `f_auto,q_auto,w_${width},c_limit`
    // insert the transformation right after '/upload/'
    return url.replace('/upload/', `/upload/${transform}/`)
  }