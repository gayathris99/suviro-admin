'use client'

import { useState, useEffect } from 'react'
import {
  IconPlus, IconSearch, IconEdit, IconTrash, IconX,
  IconCheck, IconAlertTriangle, IconPhoto, IconCloudUpload, IconLoader2,
} from '@tabler/icons-react'
import AdminShell from '@/components/AdminShell'
import { bgForColor } from '@/lib/mockData'
import { uploadToCloudinary } from '@/lib/cloudinary'
import '../categories/categories.css'

export default function ProductsPage() {
  const [prods, setProds] = useState([])
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [saving, setSaving] = useState(false)

  // form modal
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm())
  const [uploading, setUploading] = useState({ 1: false, 2: false })

  // delete modal
  const [delOpen, setDelOpen] = useState(false)
  const [delTarget, setDelTarget] = useState(null)

  function emptyForm() {
    return {
      categoryId: '', brandName: '', drugName: '',
      composition: '', dosageForm: '', imageUrl: '', imageUrl2: '',
    }
  }

  // ── load products + categories ──
  async function loadData() {
    setLoading(true)
    try {
      const [pRes, cRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
      ])
      const [pData, cData] = await Promise.all([pRes.json(), cRes.json()])
      setProds(Array.isArray(pData) ? pData : [])
      setCats(Array.isArray(cData) ? cData : [])
    } catch (err) {
      console.error('Failed to load data', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const filtered = prods.filter((p) => {
    const q = search.toLowerCase()
    return (
      p.brand_name.toLowerCase().includes(q) ||
      p.drug_name.toLowerCase().includes(q) ||
      (p.category_name && p.category_name.toLowerCase().includes(q))
    )
  })

  // ── open add / edit ──
  function openAdd() {
    if (cats.length === 0) {
      alert('Please create a category first before adding products.')
      return
    }
    setEditing(null)
    setForm({ ...emptyForm(), categoryId: cats[0].id })
    setFormOpen(true)
  }
  function openEdit(p) {
    setEditing(p)
    setForm({
      categoryId: p.category_id, brandName: p.brand_name, drugName: p.drug_name,
      composition: p.composition, dosageForm: p.dosage_form,
      imageUrl: p.image_url, imageUrl2: p.image_url_2 || '',
    })
    setFormOpen(true)
  }

  // ── upload a photo to Cloudinary (slot = 1 or 2) ──
  async function handleUpload(e, slot) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate type
    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file (PNG or JPG).')
      e.target.value = ''
      return
    }
    // Validate size — 5MB limit
    const MAX_MB = 5
    if (file.size > MAX_MB * 1024 * 1024) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1)
      alert(`Image is ${sizeMb}MB — please use an image under ${MAX_MB}MB.`)
      e.target.value = ''
      return
    }

    setUploading((u) => ({ ...u, [slot]: true }))
    try {
      const url = await uploadToCloudinary(file)
      setForm((f) => ({ ...f, [slot === 1 ? 'imageUrl' : 'imageUrl2']: url }))
    } catch (err) {
      alert('Image upload failed: ' + err.message)
    } finally {
      setUploading((u) => ({ ...u, [slot]: false }))
    }
  }

  // ── save ──
  async function save() {
    if (!form.brandName.trim() || !form.drugName.trim() || !form.composition.trim() || !form.dosageForm.trim()) {
      alert('Please fill all required fields.')
      return
    }
    if (!form.imageUrl) {
      alert('Please upload Photo 1 (required).')
      return
    }
    setSaving(true)
    try {
      const url = editing ? `/api/products/${editing.id}` : '/api/products'
      const method = editing ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const { error } = await res.json()
        alert(error || 'Failed to save product.')
        return
      }
      setFormOpen(false)
      await loadData()
    } catch (err) {
      alert('Something went wrong saving the product.')
    } finally {
      setSaving(false)
    }
  }

  // ── delete ──
  function askDelete(p) { setDelTarget(p); setDelOpen(true) }
  async function confirmDelete() {
    setSaving(true)
    try {
      const res = await fetch(`/api/products/${delTarget.id}`, { method: 'DELETE' })
      if (!res.ok) { alert('Failed to delete product.'); return }
      setDelOpen(false)
      await loadData()
    } catch (err) {
      alert('Something went wrong deleting the product.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminShell>
      {/* Header */}
      <div className="page-head">
        <div>
          <h1 className="page-title">Products</h1>
          <p className="page-sub">Manage brand products under each category</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <IconPlus size={16} /> Add Product
        </button>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search">
          <IconSearch size={18} />
          <input placeholder="Search by brand, drug or category…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <span className="count-note">{prods.length} product{prods.length === 1 ? '' : 's'}</span>
      </div>

      {/* Table */}
      <div className="panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th className="hide-sm">Composition</th>
              <th>Form</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5}><div className="empty">Loading…</div></td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5}><div className="empty">No products found</div></td></tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="prod-cell">
                      <div className="prod-img">
                        {p.image_url ? <img src={p.image_url} alt={p.brand_name} /> : <IconPhoto size={20} />}
                      </div>
                      <div>
                        <div className="prod-brand">{p.brand_name}</div>
                        <div className="prod-drug">{p.drug_name}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {p.category_name
                      ? <span className="pill" style={{ background: bgForColor(p.category_color), color: p.category_color }}>{p.category_name}</span>
                      : '—'}
                  </td>
                  <td className="hide-sm comp-cell">{p.composition.replace(/\n/g, ' ')}</td>
                  <td><span className="form-pill">{p.dosage_form}</span></td>
                  <td>
                    <div className="row-actions">
                      <button className="icon-btn" onClick={() => openEdit(p)}><IconEdit size={16} /></button>
                      <button className="icon-btn danger" onClick={() => askDelete(p)}><IconTrash size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ── ADD / EDIT MODAL ── */}
      {formOpen && (
        <div className="overlay" onClick={(e) => e.target === e.currentTarget && setFormOpen(false)}>
          <div className="modal">
            <div className="modal-head">
              <div className="modal-title">{editing ? 'Edit Product' : 'Add Product'}</div>
              <button className="icon-btn" onClick={() => setFormOpen(false)}><IconX size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="field">
                <label className="field-label">Category <span className="req">*</span></label>
                <select className="sel" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: parseInt(e.target.value) })}>
                  {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="field-label">Brand Name <span className="req">*</span></label>
                <input className="inp" value={form.brandName} onChange={(e) => setForm({ ...form, brandName: e.target.value })} placeholder="e.g. Suvigab NT" />
              </div>
              <div className="field">
                <label className="field-label">Name of the Drug <span className="req">*</span></label>
                <input className="inp" value={form.drugName} onChange={(e) => setForm({ ...form, drugName: e.target.value })} placeholder="e.g. Gabapentin 400mg & Nortriptyline 10mg Tablets" />
              </div>
              <div className="field">
                <label className="field-label">Composition <span className="req">*</span></label>
                <textarea className="ta" value={form.composition} onChange={(e) => setForm({ ...form, composition: e.target.value })} placeholder={"Each film coated tablet contains:\n…"} />
              </div>
              <div className="field">
                <label className="field-label">Dosage Form <span className="req">*</span></label>
                <input className="inp" value={form.dosageForm} onChange={(e) => setForm({ ...form, dosageForm: e.target.value })} placeholder="e.g. Tablets, Capsules, Syrup, Nasal Spray" />
              </div>

              {/* Two photo uploads */}
              <div className="field" style={{ marginBottom: 0 }}>
                <label className="field-label">Product Photos <span className="req">*</span></label>
                <div className="photo-grid">
                  {/* Photo 1 */}
                  <PhotoBox
                    label="Photo 1"
                    required
                    url={form.imageUrl}
                    uploading={uploading[1]}
                    onUpload={(e) => handleUpload(e, 1)}
                    onClear={() => setForm({ ...form, imageUrl: '' })}
                  />
                  {/* Photo 2 */}
                  <PhotoBox
                    label="Photo 2"
                    url={form.imageUrl2}
                    uploading={uploading[2]}
                    onUpload={(e) => handleUpload(e, 2)}
                    onClear={() => setForm({ ...form, imageUrl2: '' })}
                  />
                </div>
                <div className="hint">Photo 1 is required. Photo 2 is optional (e.g. back of pack).</div>
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={() => setFormOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={save} disabled={saving || uploading[1] || uploading[2]}>
                <IconCheck size={16} /> {saving ? 'Saving…' : 'Save Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE MODAL ── */}
      {delOpen && delTarget && (
        <div className="overlay" onClick={(e) => e.target === e.currentTarget && setDelOpen(false)}>
          <div className="modal modal-sm">
            <div className="modal-head">
              <div className="modal-title">Delete "{delTarget.brand_name}"?</div>
              <button className="icon-btn" onClick={() => setDelOpen(false)}><IconX size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="warn">
                <IconAlertTriangle size={21} />
                <div className="warn-tx">This will permanently delete this product. This action cannot be undone.</div>
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={() => setDelOpen(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmDelete} disabled={saving}>
                <IconTrash size={16} /> {saving ? 'Deleting…' : 'Delete product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  )
}

// ── Photo upload box ──
function PhotoBox({ label, required, url, uploading, onUpload, onClear }) {
  return (
    <div className="photo-box-wrap">
      <div className="photo-box-label">{label}{required && <span className="req"> *</span>}</div>
      {url ? (
        <div className="photo-preview">
          <img src={url} alt={label} />
          <button className="photo-clear" onClick={onClear} type="button"><IconX size={14} /></button>
        </div>
      ) : (
        <label className={`upload photo-upload ${uploading ? 'uploading' : ''}`}>
          {uploading ? (
            <div className="up-tx"><IconLoader2 size={22} className="spin" /><br />Uploading…</div>
          ) : (
            <>
              <div className="up-ic"><IconCloudUpload size={26} /></div>
              <div className="up-tx"><span className="up-link">Upload</span></div>
            </>
          )}
          <input type="file" accept="image/*" onChange={onUpload} style={{ display: 'none' }} disabled={uploading} />
        </label>
      )}
    </div>
  )
}