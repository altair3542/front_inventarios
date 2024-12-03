import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../layout/Layout";
import Categorias from "../pages/Categorias";

const Dashboard = () => <h1>Dashboard</h1>;
const Productos = () => <h1>Productos</h1>;
const Ventas = () => <h1>Ventas</h1>;

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="categorias" element={<Categorias />} />
          <Route path="productos" element={<Productos />} />
          <Route path="ventas" element={<Ventas />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
