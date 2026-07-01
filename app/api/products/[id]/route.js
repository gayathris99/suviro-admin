// ═══════════════════════════════════════════
// API: /api/products/[id]
//   PUT    → update a product
//   DELETE → delete a product
// ═══════════════════════════════════════════

import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'

// ── PUT: update a product ──
export async function PUT(request, { params }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { categoryId, brandName, drugName, composition, dosageForm, imageUrl, imageUrl2 } = body

    if (!categoryId || !brandName?.trim() || !drugName?.trim() ||
        !composition?.trim() || !dosageForm?.trim() || !imageUrl?.trim()) {
      return NextResponse.json({ error: 'All fields (and photo 1) are required' }, { status: 400 })
    }

    const [updated] = await sql`
      UPDATE products
      SET category_id = ${categoryId},
          brand_name  = ${brandName.trim()},
          drug_name   = ${drugName.trim()},
          composition = ${composition.trim()},
          dosage_form = ${dosageForm.trim()},
          image_url   = ${imageUrl.trim()},
          image_url_2 = ${imageUrl2?.trim() || null},
          updated_at  = now()
      WHERE id = ${id}
      RETURNING id, category_id, brand_name, drug_name, composition, dosage_form, image_url, image_url_2
    `

    if (!updated) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    return NextResponse.json(updated)
  } catch (err) {
    console.error('PUT /api/products/[id] failed:', err)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

// ── DELETE: delete a product ──
export async function DELETE(request, { params }) {
  try {
    const { id } = await params
    const [deleted] = await sql`
      DELETE FROM products WHERE id = ${id} RETURNING id
    `
    if (!deleted) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/products/[id] failed:', err)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}