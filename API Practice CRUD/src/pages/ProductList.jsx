import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { apiRequest, formatPrice } from '../api'

function ProductList() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiRequest('/api/products')
      .then(setProducts)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }, [])

  const filteredProducts = useMemo(() => {
    const query = search.toLowerCase().trim()
    return products.filter((product) => product.name.toLowerCase().includes(query) || product.sku.toLowerCase().includes(query))
  }, [products, search])

  return (
    <section>
      <div className="page-heading">
        <div><p className="eyebrow">Dashboard · View</p><h1>Product catalog</h1><p className="muted">Browse your shelves, prices, and point-of-sale inventory.</p></div>
        <Link className="button button-primary" to="/products/new">+ Add product</Link>
      </div>
      <div className="dashboard-stats"><div><span>Total products</span><strong>{products.length}</strong></div><div><span>Low stock</span><strong>{products.filter((product) => product.stock < 10).length}</strong></div><div><span>Categories</span><strong>{new Set(products.map((product) => product.category)).size}</strong></div></div>
      <div className="toolbar"><label className="search-field"><span>Search products</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or SKU" /></label><span className="result-count">{filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}</span></div>
      {error && <p className="error-message" role="alert">{error}</p>}
      <div className="table-wrap">
        <table><thead><tr><th>SKU</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th><span className="sr-only">Details</span></th></tr></thead>
          <tbody>{loading ? <tr><td className="table-state" colSpan="6">Loading catalog...</td></tr> : filteredProducts.length === 0 ? <tr><td className="table-state" colSpan="6">No products match your search.</td></tr> : filteredProducts.map((product) => <tr className={product.stock < 10 ? 'low-stock' : ''} key={product.id}><td className="sku">{product.sku}</td><td className="product-name">{product.name}</td><td>{product.category}</td><td>{formatPrice(product.price)}</td><td><span className="stock-value">{product.stock}</span>{product.stock < 10 && <span className="stock-warning">Low</span>}</td><td><div className="row-actions"><Link to={`/products/${product.id}`}>View details</Link></div></td></tr>)}</tbody>
        </table>
      </div>
    </section>
  )
}

export default ProductList
