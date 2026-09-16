import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest, formatPrice } from '../api'

function ProductManage() {
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiRequest('/api/products')
      .then(setProducts)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(product) {
    if (!window.confirm(`Delete ${product.name}? This cannot be undone.`)) return
    try {
      await apiRequest(`/api/products/${product.id}`, { method: 'DELETE' })
      setProducts((current) => current.filter((item) => item.id !== product.id))
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <section>
      <div className="page-heading">
        <div><p className="eyebrow">Dashboard · Actions</p><h1>Manage products</h1><p className="muted">Edit product information or remove items from the catalog.</p></div>
        <Link className="button button-primary" to="/products/new">+ Add product</Link>
      </div>
      {error && <p className="error-message" role="alert">{error}</p>}
      <div className="manage-notice"><strong>Changes affect the live catalog.</strong><span>Use edit to update details, or delete only when an item is no longer sold.</span></div>
      <div className="table-wrap">
        <table><thead><tr><th>Product</th><th>SKU</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
          <tbody>{loading ? <tr><td className="table-state" colSpan="6">Loading products...</td></tr> : products.length === 0 ? <tr><td className="table-state" colSpan="6">There are no products to manage.</td></tr> : products.map((product) => <tr className={product.stock < 10 ? 'low-stock' : ''} key={product.id}><td className="product-name">{product.name}</td><td className="sku">{product.sku}</td><td>{product.category}</td><td>{formatPrice(product.price)}</td><td><span className="stock-value">{product.stock}</span>{product.stock < 10 && <span className="stock-warning">Low</span>}</td><td><div className="row-actions"><Link to={`/products/${product.id}/edit`}>Edit</Link><button className="link-button danger" onClick={() => handleDelete(product)}>Delete</button></div></td></tr>)}</tbody>
        </table>
      </div>
    </section>
  )
}

export default ProductManage
