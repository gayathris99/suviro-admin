'use client'

import { useState } from 'react'
import {
  IconPlus, IconSearch, IconEdit, IconTrash, IconX,
  IconCheck, IconAlertTriangle, IconPhoto, IconCloudUpload,
} from '@tabler/icons-react'
import AdminShell from '@/components/AdminShell'
import {
  getProducts, getCategories, getCategoryById,
  createProduct, updateProduct, deleteProduct, bgForColor,
} from '@/lib/mockData'
import '../categories/categories.css'

export default function ProductsPage() {
  const [prods, setProds] = useState(getProducts())
  const [search, setSearch] = useState('')
  const categories = getCategories()

  // form modal
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm())
  const [imgPreview, setImgPreview] = useState(null)

  // delete modal
  const [delOpen, setDelOpen] = useState(false)
  const [delTarget, setDelTarget] = useState(null)

  function emptyForm() {
    return {
      categoryId: categories[0]?.id || 1,
      brandName: '', drugName: '', composition: '', dosageForm: '', imageUrl: '',
    }
  }

  const refresh = () => setProds(getProducts())

  const filtered = prods.filter((p) => {
    const cat = getCategoryById(p.categoryId)
    const q = search.toLowerCase()
    return (
      p.brandName.toLowerCase().includes(q) ||
      p.drugName.toLowerCase().includes(q) ||
      (cat && cat.name.toLowerCase().includes(q))
    )
  })

  // ── open ──
  function openAdd() {
    setEditing(null)
    setForm(emptyForm())
    setImgPreview(null)
    setFormOpen(true)
  }
  function openEdit(p) {
    setEditing(p)
    setForm({
      categoryId: p.categoryId, brandName: p.brandName, drugName: p.drugName,
      composition: p.composition, dosageForm: p.dosageForm, imageUrl: p.imageUrl,
    })
    setImgPreview(p.imageUrl || null)
    setFormOpen(true)
  }

  // ── fake upload (demo) — real Cloudinary upload comes later ──
  function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setImgPreview(reader.result)
      setForm((f) => ({ ...f, imageUrl: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  // ── save ──
  function save() {
    if (!form.brandName.trim() || !form.drugName.trim() || !form.composition.trim() || !form.dosageForm.trim()) {
      alert('Please fill all required fields (brand, drug, composition, dosage form).')
      return
    }
    if (!editing && !form.imageUrl) {
      alert('Please upload a product photo.')
      return
    }
    if (editing) updateProduct(editing.id, form)
    else createProduct(form)
    setFormOpen(false)
    refresh()
  }

  // ── delete ──
  function askDelete(p) { setDelTarget(p); setDelOpen(true) }
  function confirmDelete() {
    deleteProduct(delTarget.id)
    setDelOpen(false)
    refresh()
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
          <input
            placeholder="Search by brand, drug or category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
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
            {filtered.length === 0 ? (
              <tr><td colSpan={5}><div className="empty">No products found</div></td></tr>
            ) : (
              filtered.map((p) => {
                const cat = getCategoryById(p.categoryId)
                return (
                  <tr key={p.id}>
                    <td>
                      <div className="prod-cell">
                        <div className="prod-img">
                          {p.imageUrl ? <img src={p.imageUrl} alt={p.brandName} /> : <IconPhoto size={20} />}
                        </div>
                        <div>
                          <div className="prod-brand">{p.brandName}</div>
                          <div className="prod-drug">{p.drugName}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      {cat
                        ? <span className="pill" style={{ background: bgForColor(cat.color), color: cat.color }}>{cat.name}</span>
                        : '—'}
                    </td>
                    <td className="hide-sm comp-cell">{p.composition.replace(/\n/g, ' ')}</td>
                    <td><span className="form-pill">{p.dosageForm}</span></td>
                    <td>
                      <div className="row-actions">
                        <button className="icon-btn" onClick={() => openEdit(p)}><IconEdit size={16} /></button>
                        <button className="icon-btn danger" onClick={() => askDelete(p)}><IconTrash size={16} /></button>
                      </div>
                    </td>
                  </tr>
                )
              })
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
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
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
              <div className="field" style={{ marginBottom: 0 }}>
                <label className="field-label">Product Photo <span className="req">*</span></label>
                <label className={`upload ${imgPreview ? 'has-img' : ''}`}>
                  {imgPreview ? (
                    <img src={imgPreview} alt="preview" />
                  ) : (
                    <>
                      <div className="up-ic"><IconCloudUpload size={30} /></div>
                      <div className="up-tx"><span className="up-link">Click to upload</span> or drag & drop<br /><span style={{ fontSize: 11 }}>PNG, JPG up to 5MB</span></div>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
                </label>
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={() => setFormOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={save}><IconCheck size={16} /> Save Product</button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE MODAL ── */}
      {delOpen && delTarget && (
        <div className="overlay" onClick={(e) => e.target === e.currentTarget && setDelOpen(false)}>
          <div className="modal modal-sm">
            <div className="modal-head">
              <div className="modal-title">Delete "{delTarget.brandName}"?</div>
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
              <button className="btn btn-danger" onClick={confirmDelete}><IconTrash size={16} /> Delete product</button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  )
}