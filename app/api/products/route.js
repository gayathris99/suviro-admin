// ═══════════════════════════════════════════
// API: /api/products
//   GET  → list all products (with category info)
//   POST → create a new product
// ═══════════════════════════════════════════

import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

// ── GET: list all products, joined with their category ──
export async function GET() {
  try {
    const rows = await sql`
      SELECT
        p.id, p.category_id, p.brand_name, p.drug_name,
        p.composition, p.dosage_form, p.image_url, p.image_url_2,
        c.name  AS category_name,
        c.color AS category_color
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      ORDER BY p.id DESC
    `
    return NextResponse.json(rows)
  } catch (err) {
    console.error('GET /api/products failed:', err)
    return NextResponse.json({ error: 'Failed to load products' }, { status: 500 })
  }
}

// ── POST: create a product ──
export async function POST(request) {
  try {
    const body = await request.json()
    const { categoryId, brandName, drugName, composition, dosageForm, imageUrl, imageUrl2 } = body

    // photo 1 required, photo 2 optional
    if (!categoryId || !brandName?.trim() || !drugName?.trim() ||
        !composition?.trim() || !dosageForm?.trim() || !imageUrl?.trim()) {
      return NextResponse.json({ error: 'All fields (and photo 1) are required' }, { status: 400 })
    }

    const [created] = await sql`
      INSERT INTO products
        (category_id, brand_name, drug_name, composition, dosage_form, image_url, image_url_2)
      VALUES
        (${categoryId}, ${brandName.trim()}, ${drugName.trim()}, ${composition.trim()},
         ${dosageForm.trim()}, ${imageUrl.trim()}, ${imageUrl2?.trim() || null})
      RETURNING id, category_id, brand_name, drug_name, composition, dosage_form, image_url, image_url_2
    `
    return NextResponse.json(created, { status: 201 })
  } catch (err) {
    console.error('POST /api/products failed:', err)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}