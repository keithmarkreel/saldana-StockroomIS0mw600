import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { apiRequest, formatPrice } from '../api'

function ProductDetails() {
  const { id } = useParams(); const [product, setProduct] = useState(null); const [error, setError] = useState('')
  useEffect(() => { apiRequest(`/api/products/${id}`).then(setProduct).catch((requestError) => setError(requestError.message)) }, [id])
  if (error) return <section className="details-page"><Link className="back-link" to="/">← Back to catalog</Link><p className="error-message" role="alert">{error}</p></section>
  if (!product) return <section className="details-page"><p className="muted">Loading product...</p></section>
  return <section className="details-page"><Link className="back-link" to="/">← Back to catalog</Link><div className="page-heading compact"><div><p className="eyebrow">Product record</p><h1>{product.name}</h1><p className="muted">{product.category} · {product.sku}</p></div><Link className="button button-secondary" to={`/products/${id}/edit`}>Edit product</Link></div><div className="details-card"><div className="details-main"><span className="detail-label">Current stock</span><strong>{product.stock}</strong><span className={product.stock < 10 ? 'stock-warning' : 'stock-ok'}>{product.stock < 10 ? 'Low stock' : 'In stock'}</span></div><dl><div><dt>Name</dt><dd>{product.name}</dd></div><div><dt>Category</dt><dd>{product.category}</dd></div><div><dt>Price</dt><dd>{formatPrice(product.price)}</dd></div><div><dt>SKU</dt><dd>{product.sku}</dd></div></dl></div></section>
}

export default ProductDetails
