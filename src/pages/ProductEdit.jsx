import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ProductForm from '../components/ProductForm'
import { apiRequest } from '../api'

function ProductEdit() {
  const { id } = useParams(); const navigate = useNavigate()
  const [product, setProduct] = useState(null); const [error, setError] = useState(''); const [isSubmitting, setIsSubmitting] = useState(false)
  useEffect(() => { apiRequest(`/api/products/${id}`).then(setProduct).catch((requestError) => setError(requestError.message)) }, [id])
  async function updateProduct(values) { setError(''); setIsSubmitting(true); try { await apiRequest(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(values) }); navigate('/') } catch (requestError) { setError(requestError.message) } finally { setIsSubmitting(false) } }
  if (error && !product) return <section className="form-page"><Link className="back-link" to="/">← Back to catalog</Link><p className="error-message" role="alert">{error}</p></section>
  if (!product) return <section className="form-page"><p className="muted">Loading product...</p></section>
  return <section className="form-page"><Link className="back-link" to={`/products/${id}`}>← Back to product</Link><div className="page-heading compact"><div><p className="eyebrow">Catalog entry</p><h1>Edit product</h1><p className="muted">Update the details for {product.name}.</p></div></div><ProductForm initialData={product} submitLabel="Save changes" onSubmit={updateProduct} error={error} isSubmitting={isSubmitting} /></section>
}

export default ProductEdit
