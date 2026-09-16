import { NavLink, Route, Routes } from 'react-router-dom'
import ProductCreate from './pages/ProductCreate'
import ProductDetails from './pages/ProductDetails'
import ProductEdit from './pages/ProductEdit'
import ProductList from './pages/ProductList'

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink className="brand" to="/">
          <span className="brand-mark">S</span>
          <span>Stockroom</span>
        </NavLink>
        <span className="topbar-note">Point-of-sale catalog</span>
      </header>
      <main className="page-wrap">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/products/new" element={<ProductCreate />} />
          <Route path="/products/:id/edit" element={<ProductEdit />} />
          <Route path="/products/:id" element={<ProductDetails />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
