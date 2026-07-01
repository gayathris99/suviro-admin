'use client'

import { useState } from 'react'
import {
  IconPlus, IconSearch, IconEdit, IconTrash, IconX,
  IconCheck, IconAlertTriangle,
} from '@tabler/icons-react'
import AdminShell from '@/components/AdminShell'
import CategoryIcon from '@/components/CategoryIcon'
import {
  getCategories, createCategory, updateCategory, deleteCategory,
  productCountForCategory, bgForColor,
  ICON_OPTIONS, COLOR_OPTIONS,
} from '@/lib/mockData'
import './categories.css'

export default function CategoriesPage() {
  // local copy of data so the UI re-renders on change
  const [cats, setCats] = useState(getCategories())
  const [search, setSearch] = useState('')

  // modal state
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', tagline: '', description: '', icon: 'Brain', color: COLOR_OPTIONS[0][0] })

  // delete modal state
  const [delOpen, setDelOpen] = useState(false)
  const [delTarget, setDelTarget] = useState(null)
  const [delConfirm, setDelConfirm] = useState('')

  const refresh = () => setCats(getCategories())

  const filtered = cats.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.tagline.toLowerCase().includes(search.toLowerCase())
  )

  // ── open add / edit ──
  function openAdd() {
    setEditing(null)
    setForm({ name: '', tagline: '', description: '', icon: 'Brain', color: COLOR_OPTIONS[0][0] })
    setFormOpen(true)
  }
  function openEdit(cat) {
    setEditing(cat)
    setForm({ name: cat.name, tagline: cat.tagline, description: cat.description, icon: cat.icon, color: cat.color })
    setFormOpen(true)
  }

  // ── save ──
  function save() {
    if (!form.name.trim() || !form.tagline.trim() || !form.description.trim()) {
      alert('Please fill all required fields.')
      return
    }
    if (editing) updateCategory(editing.id, form)
    else createCategory(form)
    setFormOpen(false)
    refresh()
  }

  // ── delete ──
  function askDelete(cat) {
    setDelTarget(cat)
    setDelConfirm('')
    setDelOpen(true)
  }
  function confirmDelete() {
    const count = productCountForCategory(delTarget.id)
    if (count > 0 && delConfirm.trim() !== delTarget.name) {
      alert(`Please type "${delTarget.name}" to confirm.`)
      return
    }
    deleteCategory(delTarget.id)
    setDelOpen(false)
    refresh()
  }

  return (
    <AdminShell>
      {/* Header */}
      <div className="page-head">
        <div>
          <h1 className="page-title">Categories</h1>
          <p className="page-sub">Manage therapeutic divisions shown on the website</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <IconPlus size={16} /> Add Category
        </button>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="search">
          <IconSearch size={18} />
          <input
            placeholder="Search categories…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <span className="count-note">
          {cats.length} categor{cats.length === 1 ? 'y' : 'ies'}
        </span>
      </div>

      {/* Table */}
      <div className="panel">
        <table className="data-table">
          <thead>
            <tr>
              <th>Category</th>
              <th className="hide-sm">Description</th>
              <th>Products</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={4}><div className="empty">No categories found</div></td></tr>
            ) : (
              filtered.map((c) => {
                const count = productCountForCategory(c.id)
                return (
                  <tr key={c.id}>
                    <td>
                      <div className="cat-cell">
                        <div className="cat-ic" style={{ background: bgForColor(c.color), color: c.color }}>
                          <CategoryIcon name={c.icon} size={24} color={c.color} />
                        </div>
                        <div>
                          <div className="cat-nm">{c.name}</div>
                          <div className="cat-tg">{c.tagline}</div>
                        </div>
                      </div>
                    </td>
                    <td className="hide-sm desc-cell">
                      {c.description.length > 90 ? c.description.slice(0, 90) + '…' : c.description}
                    </td>
                    <td><span className="form-pill">{count} product{count === 1 ? '' : 's'}</span></td>
                    <td>
                      <div className="row-actions">
                        <button className="icon-btn" onClick={() => openEdit(c)}><IconEdit size={16} /></button>
                        <button className="icon-btn danger" onClick={() => askDelete(c)}><IconTrash size={16} /></button>
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
              <div className="modal-title">{editing ? 'Edit Category' : 'Add Category'}</div>
              <button className="icon-btn" onClick={() => setFormOpen(false)}><IconX size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="field">
                <label className="field-label">Category Name <span className="req">*</span></label>
                <input className="inp" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Neuro" />
              </div>
              <div className="field">
                <label className="field-label">Tagline <span className="req">*</span></label>
                <input className="inp" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} placeholder="Short one-liner shown on the card" />
              </div>
              <div className="field">
                <label className="field-label">Description <span className="req">*</span></label>
                <textarea className="ta" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short paragraph for the division card" />
              </div>
              <div className="field">
                <label className="field-label">Icon <span className="req">*</span></label>
                <div className="icon-picker">
                  {ICON_OPTIONS.map((opt) => (
                    <button
                      key={opt.name}
                      className={`ip ${form.icon === opt.name ? 'ip--sel' : ''}`}
                      title={opt.label}
                      onClick={() => setForm({ ...form, icon: opt.name })}
                    >
                      <CategoryIcon name={opt.name} size={22} color={form.icon === opt.name ? '#fff' : '#6b7280'} />
                    </button>
                  ))}
                </div>
                <div className="hint">Pick the icon that best represents this category</div>
              </div>
              <div className="field">
                <label className="field-label">Color <span className="req">*</span></label>
                <div className="color-picker">
                  {COLOR_OPTIONS.map(([color]) => (
                    <button
                      key={color}
                      className={`cp ${form.color === color ? 'cp--sel' : ''}`}
                      style={{ background: color }}
                      onClick={() => setForm({ ...form, color })}
                    />
                  ))}
                </div>
              </div>
              {/* Live preview */}
              <div className="field" style={{ marginBottom: 0 }}>
                <label className="field-label">Preview</label>
                <div className="preview">
                  <div className="cat-ic" style={{ background: bgForColor(form.color), color: form.color }}>
                    <CategoryIcon name={form.icon} size={24} color={form.color} />
                  </div>
                  <div>
                    <div className="cat-nm">{form.name || 'Category name'}</div>
                    <div className="cat-tg" style={{ color: form.color }}>{form.tagline || 'Tagline'}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={() => setFormOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={save}><IconCheck size={16} /> Save Category</button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE MODAL ── */}
      {delOpen && delTarget && (
        <div className="overlay" onClick={(e) => e.target === e.currentTarget && setDelOpen(false)}>
          <div className="modal modal-sm">
            <div className="modal-head">
              <div className="modal-title">Delete "{delTarget.name}"?</div>
              <button className="icon-btn" onClick={() => setDelOpen(false)}><IconX size={16} /></button>
            </div>
            <div className="modal-body">
              <div className="warn">
                <IconAlertTriangle size={21} />
                <div className="warn-tx">
                  {productCountForCategory(delTarget.id) > 0
                    ? <>Deleting this category will <strong>permanently delete all {productCountForCategory(delTarget.id)} product{productCountForCategory(delTarget.id) === 1 ? '' : 's'}</strong> under it. This cannot be undone.</>
                    : <>This category has no products. This action cannot be undone.</>}
                </div>
              </div>
              {productCountForCategory(delTarget.id) > 0 && (
                <div className="field" style={{ marginTop: 16, marginBottom: 0 }}>
                  <label className="field-label">Type <strong>{delTarget.name}</strong> to confirm</label>
                  <input className="inp" value={delConfirm} onChange={(e) => setDelConfirm(e.target.value)} placeholder={delTarget.name} />
                </div>
              )}
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost" onClick={() => setDelOpen(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={confirmDelete}>
                <IconTrash size={16} /> Delete category{productCountForCategory(delTarget.id) > 0 ? ' & products' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  )
}