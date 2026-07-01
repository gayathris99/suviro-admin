// ═══════════════════════════════════════════
// API: /api/categories
//   GET  → list all categories (with product counts)
//   POST → create a new category
// ═══════════════════════════════════════════

import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

// ── GET: list all categories ──
export async function GET() {
  try {
    const rows = await sql`
      SELECT
        c.id, c.name, c.tagline, c.description,
        c.icon, c.color, c.sort_order,
        COUNT(p.id)::int AS product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id
      GROUP BY c.id
      ORDER BY c.sort_order, c.id
    `
    return NextResponse.json(rows)
  } catch (err) {
    console.error('GET /api/categories failed:', err)
    return NextResponse.json({ error: 'Failed to load categories' }, { status: 500 })
  }
}

// ── POST: create a category ──
export async function POST(request) {
  try {
    const body = await request.json()
    const { name, tagline, description, icon, color } = body

    // basic validation
    if (!name?.trim() || !tagline?.trim() || !description?.trim() || !icon || !color) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // next sort_order = current max + 1
    const [{ next_order }] = await sql`
      SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_order FROM categories
    `

    const [created] = await sql`
      INSERT INTO categories (name, tagline, description, icon, color, sort_order)
      VALUES (${name.trim()}, ${tagline.trim()}, ${description.trim()}, ${icon}, ${color}, ${next_order})
      RETURNING id, name, tagline, description, icon, color, sort_order
    `
    return NextResponse.json(created, { status: 201 })
  } catch (err) {
    console.error('POST /api/categories failed:', err)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}