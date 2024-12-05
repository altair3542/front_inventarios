import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "./ProtectedRoute";

import Layout from "../layout/Layout";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Categorias from "../pages/Categorias";
import Dashboard from "../pages/Dashboard";
import Productos from "../pages/Productos";
import Ventas from "../pages/Ventas";

const AppRoutes = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Rutas Protegidas */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="categorias" element={<Categorias />} />
            <Route path="productos" element={<Productos />} />
            <Route path="ventas" element={<Ventas />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default AppRoutes;
