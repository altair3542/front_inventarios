import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FaTachometerAlt, FaTags, FaBox, FaShoppingCart, FaBars } from "react-icons/fa";

const Layout = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const menuItems = [
    { to: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { to: "/categorias", label: "Categorías", icon: <FaTags /> },
    { to: "/productos", label: "Productos", icon: <FaBox /> },
    { to: "/ventas", label: "Ventas", icon: <FaShoppingCart /> },
  ];

  return (
    <div className="flex h-screen bg-gray-300">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarExpanded ? "w-48" : "w-12"
        } bg-blue-600 text-white transition-all duration-300 ease-in-out`}
      >
        {/* Header del Sidebar */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-blue-700">
          <span
            className={`${
              isSidebarExpanded ? "text-lg font-bold" : "hidden"
            } transition-all duration-300`}
          >
            Menú
          </span>
          <button
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
            className="text-white text-xl"
          >
            <FaBars />
          </button>
        </div>

        {/* Navegación */}
        <nav className="mt-4">
          <ul>
            {menuItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-2 ${
                      isActive ? "bg-blue-800" : "hover:bg-blue-700"
                    }`
                  }
                >
                  <span className="text-lg">{item.icon}</span>
                  <span
                    className={`${
                      isSidebarExpanded ? "block" : "hidden"
                    } text-sm font-medium transition-all duration-300`}
                  >
                    {item.label}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
