// Renders a Healthicons icon by its component name (e.g. "Kidneys").
// Used in the category table, icon picker, and anywhere a category
// icon needs to show. Falls back gracefully if a name is missing.
'use client'

import * as HealthIcons from 'healthicons-react'

export default function CategoryIcon({ name, size = 24, color = 'currentColor' }) {
  const Icon = HealthIcons[name]
  if (!Icon) {
    // Fallback if an icon name doesn't exist in the package
    const Fallback = HealthIcons['MedicalSearch']
    return <Fallback width={size} height={size} fill={color} />
  }
  return <Icon width={size} height={size} fill={color} />
}