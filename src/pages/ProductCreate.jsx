import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ProductForm from '../components/ProductForm'
import { apiRequest } from '../api'

function ProductCreate() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function createProduct(product) {
    setError(''); setIsSubmitting(true)
    try { await apiRequest('/api/products', { method: 'POST', body: JSON.stringify(product) }); navigate('/') } catch (requestError) { setError(requestError.message) } finally { setIsSubmitting(false) }
  }

  return <section className="form-page"><Link className="back-link" to="/">← Back to catalog</Link><div className="page-heading compact"><div><p className="eyebrow">Catalog entry</p><h1>Add a product</h1><p className="muted">Add a new item to your point-of-sale inventory.</p></div></div><ProductForm submitLabel="Create product" onSubmit={createProduct} error={error} isSubmitting={isSubmitting} /></section>
}

export default ProductCreate
