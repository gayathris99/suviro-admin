// ═══════════════════════════════════════════
// API: /api/categories/[id]
//   PUT    → update a category
//   DELETE → delete a category (cascades to its products)
// ═══════════════════════════════════════════

import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

// ── PUT: update a category ──
export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, tagline, description, icon, color } = body

    if (!name?.trim() || !tagline?.trim() || !description?.trim() || !icon || !color) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    const [updated] = await sql`
      UPDATE categories
      SET name = ${name.trim()},
          tagline = ${tagline.trim()},
          description = ${description.trim()},
          icon = ${icon},
          color = ${color},
          updated_at = now()
      WHERE id = ${id}
      RETURNING id, name, tagline, description, icon, color, sort_order
    `

    if (!updated) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }
    return NextResponse.json(updated)
  } catch (err) {
    console.error('PUT /api/categories/[id] failed:', err)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

// ── DELETE: delete a category (products cascade automatically) ──
export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    const [deleted] = await sql`
      DELETE FROM categories WHERE id = ${id} RETURNING id
    `
    if (!deleted) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/categories/[id] failed:', err)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}