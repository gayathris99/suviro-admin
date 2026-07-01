// ═══════════════════════════════════════════
// TEMPORARY IN-MEMORY DATA LAYER
// ───────────────────────────────────────────
// This mimics the database while we build the UI.
// Later, these functions get swapped for real SQL
// queries against Neon — the rest of the app won't change.
// ═══════════════════════════════════════════

// ── Curated icon set for the category icon picker ──
// Verified Healthicons component names (healthicons-react).
// Each entry: { name: component name, label: human label }
export const ICON_OPTIONS = [
    // Organs
    { name: 'Brain',        label: 'Brain' },
    { name: 'HeartOrgan',   label: 'Heart' },
    { name: 'Lungs',        label: 'Lungs' },
    { name: 'Kidneys',      label: 'Kidneys' },
    { name: 'Liver',        label: 'Liver' },
    { name: 'Stomach',      label: 'Stomach' },
    { name: 'Intestine',    label: 'Intestine' },
    { name: 'Bladder',      label: 'Bladder' },
    { name: 'Gallbladder',  label: 'Gallbladder' },
    { name: 'Pancreas',     label: 'Pancreas' },
    { name: 'Thyroid',      label: 'Thyroid' },
    { name: 'Spine',        label: 'Spine' },
    { name: 'Joints',       label: 'Joints' },
    { name: 'Nerve',        label: 'Nerve' },
    { name: 'BloodVessel',  label: 'Blood vessel' },
    // Body parts / senses
    { name: 'Eye',          label: 'Eye' },
    { name: 'Ear',          label: 'Ear' },
    { name: 'Nose',         label: 'Nose' },
    { name: 'Mouth',        label: 'Mouth' },
    { name: 'Tooth',        label: 'Tooth' },
    { name: 'Foot',         label: 'Foot' },
    // Cardiology / vitals
    { name: 'Heartbeat',         label: 'Heartbeat' },
    { name: 'HeartCardiogram',   label: 'Cardiogram' },
    { name: 'BloodPressure',     label: 'Blood pressure' },
    { name: 'BloodCells',        label: 'Blood cells' },
    { name: 'BloodDrop',         label: 'Blood drop' },
    { name: 'Diabetes',          label: 'Diabetes' },
    // Pharma / lab / care
    { name: 'Pill1',        label: 'Pill' },
    { name: 'Pills2',       label: 'Pills' },
    { name: 'Syringe',      label: 'Syringe' },
    { name: 'SyringeVaccine', label: 'Vaccine' },
    { name: 'Stethoscope',  label: 'Stethoscope' },
    { name: 'Microscope',   label: 'Microscope' },
    { name: 'Dna',          label: 'DNA' },
    { name: 'Virus',        label: 'Virus' },
    { name: 'Bacteria',     label: 'Bacteria' },
    { name: 'Wheelchair',   label: 'Wheelchair' },
    { name: 'Eyeglasses',   label: 'Eyeglasses' },
    { name: 'HearingAid',   label: 'Hearing aid' },
    { name: 'MedicalSearch', label: 'Medical search' },
  ]
  
  
  // ── Color swatches for the category color picker ──
  // Each entry: [solid color, soft background tint]
  export const COLOR_OPTIONS = [
    ['#7c3aed', '#f3e8ff'], // violet
    ['#6366f1', '#e0e7ff'], // indigo
    ['#2563eb', '#dbeafe'], // blue
    ['#0891b2', '#cffafe'], // cyan
    ['#0d9488', '#ccfbf1'], // teal
    ['#16a34a', '#dcfce7'], // green
    ['#65a30d', '#ecfccb'], // lime
    ['#ca8a04', '#fef3c7'], // amber
    ['#ea580c', '#ffedd5'], // orange
    ['#dc2626', '#fee2e2'], // red
    ['#db2777', '#fce7f3'], // pink
    ['#9333ea', '#f3e8ff'], // purple
    ['#e11d48', '#ffe4e6'], // rose
    ['#475569', '#f1f5f9'], // slate
    ['#0f766e', '#ccfbf1'], // deep teal
    ['#b45309', '#fef3c7'], // bronze
  ]
  
  // Helper: soft background tint for a given solid color
  export function bgForColor(color) {
    const match = COLOR_OPTIONS.find((c) => c[0] === color)
    return match ? match[1] : '#eef2ff'
  }
  
  // ── In-memory store ──
  let categories = [
    { id: 1, name: 'Neuro',  tagline: 'Clarity for the mind.',     description: 'Neuroprotective and psychotherapeutic formulations supporting cognition, mood and chronic neurological care.', icon: 'Brain',      color: '#7c3aed', sortOrder: 1 },
    { id: 2, name: 'Nephro', tagline: 'Care for renal balance.',   description: 'Targeted therapies for renal protection, mineral balance and chronic kidney disease management.',              icon: 'Kidneys',    color: '#2563eb', sortOrder: 2 },
    { id: 3, name: 'Cardio', tagline: 'Strength for the heart.',   description: 'Evidence-based cardiovascular molecules covering hypertension, lipid management and heart-failure protocols.',  icon: 'HeartOrgan', color: '#dc2626', sortOrder: 3 },
    { id: 4, name: 'Gastro', tagline: 'Comfort for digestion.',    description: 'Solutions across acid control, motility, and hepatic care designed for tolerability and adherence.',            icon: 'Stomach',    color: '#ca8a04', sortOrder: 4 },
  ]
  
  let products = [
    { id: 1, categoryId: 1, brandName: 'Suvigab NT',   drugName: 'Gabapentin 400mg & Nortriptyline 10mg Tablets',         composition: 'Each film coated tablet contains:\nGabapentin I.P. 400mg\nNortriptyline Hydrochloride I.P. Eq. to Nortriptyline 10mg\nExcipients q.s.', dosageForm: 'Tablets', imageUrl: '' },
    { id: 2, categoryId: 1, brandName: 'Virocoxib TH', drugName: 'Thiocolchicoside 4mg & Etoricoxib 60mg Tablets',         composition: 'Each film coated tablet contains:\nThiocolchicoside I.P. 4mg\nEtoricoxib I.P. 60mg\nExcipients q.s.', dosageForm: 'Tablets', imageUrl: '' },
    { id: 3, categoryId: 1, brandName: 'Levisutam 500', drugName: 'Levetiracetam Tablets I.P. 500mg',                      composition: 'Each film coated tablet contains:\nLevetiracetam I.P. 500mg\nExcipients q.s.', dosageForm: 'Tablets', imageUrl: '' },
    { id: 4, categoryId: 1, brandName: 'Citiviro P',   drugName: 'Citicoline Sodium 500mg & Piracetam 800mg Tablets',     composition: 'Each film coated tablet contains:\nCiticoline sodium Eq. to citicoline I.P. 500mg\nPiracetam I.P. 800mg\nExcipients q.s.', dosageForm: 'Tablets', imageUrl: '' },
    { id: 5, categoryId: 1, brandName: 'Vipirtine P',  drugName: 'Flupirtine Maleate 100mg + Paracetamol 325mg',          composition: 'Each film coated tablet contains:\nFlupirtine Maleate I.P. 100mg\nParacetamol I.P. 325mg\nExcipients q.s.', dosageForm: 'Tablets', imageUrl: '' },
    { id: 6, categoryId: 3, brandName: 'Naxvirom',     drugName: 'Naproxen Tablets I.P. 500mg',                           composition: 'Each uncoated tablet contains:\nNaproxen I.P. 500mg\nExcipients q.s.', dosageForm: 'Tablets', imageUrl: '' },
    { id: 7, categoryId: 1, brandName: 'Vertisuv 16',  drugName: 'Betahistine HCL Tablets I.P. 16mg (9.6mm)',             composition: 'Each uncoated tablet contains:\nBetahistine Hydrochloride I.P. 16mg\nExcipients q.s.', dosageForm: 'Tablets', imageUrl: '' },
    { id: 8, categoryId: 1, brandName: 'Bacloviro 10', drugName: 'Baclofen Tablets I.P. 10mg',                            composition: 'Each uncoated tablet contains:\nBaclofen I.P. 10mg\nExcipients q.s.', dosageForm: 'Tablets', imageUrl: '' },
  ]
  
  let nextCategoryId = 5
  let nextProductId = 9
  
  // ═══════════════════════════════════════════
  // CATEGORY OPERATIONS
  // ═══════════════════════════════════════════
  export function getCategories() {
    return [...categories].sort((a, b) => a.sortOrder - b.sortOrder)
  }
  
  export function getCategoryById(id) {
    return categories.find((c) => c.id === id) || null
  }
  
  export function createCategory(data) {
    const cat = {
      id: nextCategoryId++,
      name: data.name.trim(),
      tagline: data.tagline.trim(),
      description: data.description.trim(),
      icon: data.icon,
      color: data.color,
      sortOrder: categories.length + 1,
    }
    categories.push(cat)
    return cat
  }
  
  export function updateCategory(id, data) {
    const cat = getCategoryById(id)
    if (!cat) return null
    cat.name = data.name.trim()
    cat.tagline = data.tagline.trim()
    cat.description = data.description.trim()
    cat.icon = data.icon
    cat.color = data.color
    return cat
  }
  
  // Deleting a category cascades — all its products are removed too.
  export function deleteCategory(id) {
    products = products.filter((p) => p.categoryId !== id)
    categories = categories.filter((c) => c.id !== id)
  }
  
  export function productCountForCategory(id) {
    return products.filter((p) => p.categoryId === id).length
  }
  
  // ═══════════════════════════════════════════
  // PRODUCT OPERATIONS
  // ═══════════════════════════════════════════
  export function getProducts() {
    return [...products]
  }
  
  export function getProductById(id) {
    return products.find((p) => p.id === id) || null
  }
  
  export function createProduct(data) {
    const prod = {
      id: nextProductId++,
      categoryId: data.categoryId,
      brandName: data.brandName.trim(),
      drugName: data.drugName.trim(),
      composition: data.composition.trim(),
      dosageForm: data.dosageForm.trim(),
      imageUrl: data.imageUrl || '',
    }
    products.push(prod)
    return prod
  }
  
  export function updateProduct(id, data) {
    const prod = getProductById(id)
    if (!prod) return null
    prod.categoryId = data.categoryId
    prod.brandName = data.brandName.trim()
    prod.drugName = data.drugName.trim()
    prod.composition = data.composition.trim()
    prod.dosageForm = data.dosageForm.trim()
    if (data.imageUrl) prod.imageUrl = data.imageUrl
    return prod
  }
  
  export function deleteProduct(id) {
    products = products.filter((p) => p.id !== id)
  }