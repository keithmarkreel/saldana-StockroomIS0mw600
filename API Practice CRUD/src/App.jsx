import { NavLink, Route, Routes } from 'react-router-dom'
import ProductCreate from './pages/ProductCreate'
import ProductDetails from './pages/ProductDetails'
import ProductEdit from './pages/ProductEdit'
import ProductList from './pages/ProductList'
import ProductManage from './pages/ProductManage'

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink className="brand" to="/">
          <span className="brand-mark">S</span>
          <span>Stockroom</span>
        </NavLink>
        <nav className="main-nav" aria-label="Primary navigation">
          <NavLink to="/" end>View products</NavLink>
          <NavLink to="/products/new">Add product</NavLink>
          <NavLink to="/products/manage">Manage products</NavLink>
        </nav>
      </header>
      <main className="page-wrap">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/products/new" element={<ProductCreate />} />
          <Route path="/products/manage" element={<ProductManage />} />
          <Route path="/products/:id/edit" element={<ProductEdit />} />
          <Route path="/products/:id" element={<ProductDetails />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
