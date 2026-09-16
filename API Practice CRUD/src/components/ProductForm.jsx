import { useState } from 'react'

const initialValues = { name: '', category: '', price: '', stock: '', sku: '' }

function ProductForm({ initialData = initialValues, submitLabel, onSubmit, error, isSubmitting }) {
  const [form, setForm] = useState({ ...initialValues, ...initialData })
  const [validationError, setValidationError] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setValidationError('')
    if (!form.name.trim() || !form.category.trim() || !form.sku.trim() || form.price === '' || form.stock === '') {
      setValidationError('Complete every field before saving this product.')
      return
    }
    if (Number(form.price) < 0 || Number(form.stock) < 0 || Number.isNaN(Number(form.price)) || Number.isNaN(Number(form.stock))) {
      setValidationError('Price and stock must be non-negative numbers.')
      return
    }
    await onSubmit({ ...form, name: form.name.trim(), category: form.category.trim(), sku: form.sku.trim(), price: Number(form.price), stock: Number(form.stock) })
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      {(validationError || error) && <p className="error-message" role="alert">{validationError || error}</p>}
      <div className="form-grid">
        <label>Name<input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Arabica Coffee" required /></label>
        <label>Category<input name="category" value={form.category} onChange={handleChange} placeholder="e.g. Beverages" required /></label>
        <label>Price<input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} placeholder="0.00" required /></label>
        <label>Stock<input name="stock" type="number" min="0" step="1" value={form.stock} onChange={handleChange} placeholder="0" required /></label>
        <label className="full-width">SKU<input name="sku" value={form.sku} onChange={handleChange} placeholder="e.g. BEV-001" required /></label>
      </div>
      <div className="form-actions">
        <button className="button button-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : submitLabel}</button>
      </div>
    </form>
  )
}

export default ProductForm
