import { Outlet } from "react-router-dom"

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-300">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-600 text-white">
        <nav>
          <ul>
            <li><a href="/dashboard"></a>Dashboard</li>
            <li><a href="/categorias"></a>Categorias</li>
            <li><a href="/productos"></a>Productos</li>
            <li><a href="/ventas"></a>Ventas</li>
          </ul>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
