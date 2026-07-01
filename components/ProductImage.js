'use client'

import { useState, useRef } from 'react'
import { optimizeCloudinary } from '@/lib/cloudinaryUrl'

// Shows product photo(s). If two images exist:
//   - dots to click/tap between them
//   - swipe left/right (touch) to switch
// Same behavior on all devices. Single image → static, no dots.
export default function ProductImage({ images, alt }) {
  const imgs = (images || []).filter(Boolean).map((u) => optimizeCloudinary(u, 800))
  const [active, setActive] = useState(0)
  const touchStartX = useRef(null)

  // No images → placeholder
  if (imgs.length === 0) {
    return (
      <div className="product-photo">
        <div className="product-photo-ph" />
      </div>
    )
  }

  // Single image → static
  if (imgs.length === 1) {
    return (
      <div className="product-photo">
        <img src={imgs[0]} alt={alt} />
      </div>
    )
  }

  // Multiple images → dots + swipe
  function onTouchStart(e) {
    touchStartX.current = e.touches[0].clientX
  }
  function onTouchEnd(e) {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 40) {
      if (dx < 0) setActive((a) => Math.min(a + 1, imgs.length - 1)) // swipe left → next
      else setActive((a) => Math.max(a - 1, 0))                       // swipe right → prev
    }
    touchStartX.current = null
  }

  return (
    <div
      className="product-photo product-photo--multi"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {imgs.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`${alt} — photo ${i + 1}`}
          className="product-photo-layer"
          style={{ opacity: i === active ? 1 : 0 }}
        />
      ))}

      {/* Dots */}
      <div className="product-dots">
        {imgs.map((_, i) => (
          <button
            key={i}
            className={`product-dot ${i === active ? 'product-dot--active' : ''}`}
            onClick={() => setActive(i)}
            aria-label={`Show photo ${i + 1}`}
            type="button"
          />
        ))}
      </div>
    </div>
  )
}