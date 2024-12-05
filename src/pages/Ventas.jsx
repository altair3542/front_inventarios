import { useState, useEffect } from "react";
import api, { setAuthToken } from "../api/api";
import { format } from "date-fns";

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    producto: "",
    cantidad: "",
    total: "",
    fecha: "",
  });

  const [productos, setProductos] = useState([]); // Para cargar productos disponibles

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAuthToken(token);
    } else {
      setError("No estás autenticado. Inicia sesión para continuar.");
      setLoading(false);
      return;
    }

    // Cargar ventas
    api.get("/ventas/")
      .then((response) => {
        setVentas(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error al cargar las ventas.");
        setLoading(false);
      });

    // Cargar productos disponibles
    api.get("/productos/")
      .then((response) => setProductos(response.data))
      .catch(() => setError("Error al cargar los productos."));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/ventas/", formData);
      setVentas([...ventas, response.data]);
      setFormData({ producto: "", cantidad: "", total: "", fecha: "" });
      setError("");
    } catch (err) {
      setError("Error al registrar la venta.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta venta?")) return;
    try {
      await api.delete(`/ventas/${id}/`);
      setVentas(ventas.filter((venta) => venta.id !== id));
    } catch (err) {
      setError("Error al eliminar la venta.");
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Ventas</h1>

      {/* Formulario para crear una nueva venta */}
      <form onSubmit={handleCreate} className="mb-6 flex gap-4">
        <select
          value={formData.producto}
          onChange={(e) =>
            setFormData({ ...formData, producto: e.target.value })
          }
          className="border p-2 rounded w-full"
        >
          <option value="">Selecciona un producto</option>
          {productos.map((producto) => (
            <option key={producto.id} value={producto.id}>
              {producto.nombre}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={formData.cantidad}
          onChange={(e) =>
            setFormData({ ...formData, cantidad: e.target.value })
          }
          placeholder="Cantidad"
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          value={formData.total}
          onChange={(e) =>
            setFormData({ ...formData, total: e.target.value })
          }
          placeholder="Total"
          className="border p-2 rounded w-full"
        />
        <input
          type="date"
          value={formData.fecha}
          onChange={(e) =>
            setFormData({ ...formData, fecha: e.target.value })
          }
          className="border p-2 rounded w-full"
        />
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Registrar Venta
        </button>
      </form>

      {/* Tabla de ventas */}
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Producto</th>
            <th className="border border-gray-300 px-4 py-2">Cantidad</th>
            <th className="border border-gray-300 px-4 py-2">Total</th>
            <th className="border border-gray-300 px-4 py-2">Fecha</th>
            <th className="border border-gray-300 px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta) => (
            <tr key={venta.id}>
              <td className="border border-gray-300 px-4 py-2">{venta.id}</td>
              <td className="border border-gray-300 px-4 py-2">
                {venta.producto?.nombre || "Producto no disponible"}
              </td>
              <td className="border border-gray-300 px-4 py-2">{venta.cantidad}</td>
              <td className="border border-gray-300 px-4 py-2">{venta.total}</td>
              <td className="border border-gray-300 px-4 py-2">
                {format(new Date(venta.fecha), "dd/MM/yyyy HH:mm")}
              </td>
              <td className="border border-gray-300 px-4 py-2 flex gap-2">
                <button
                  onClick={() => handleDelete(venta.id)}
                  className="bg-red-500 text-white py-1 px-2 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Ventas;
