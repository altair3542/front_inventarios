import { useState, useEffect } from "react";
import api, { setAuthToken } from "../api/api";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ nombre: "", precio: "", stock: "" });
  const [editingProduct, setEditingProduct] = useState(null);
  const [updatedData, setUpdatedData] = useState({ nombre: "", precio: "", stock: "" });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAuthToken(token);
    } else {
      setError("No estás autenticado. Inicia sesión para continuar.");
      setLoading(false);
      return;
    }

    api.get("/productos/")
      .then((response) => {
        setProductos(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error al cargar los productos.");
        setLoading(false);
      });
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/productos/", formData);
      setProductos([...productos, response.data]);
      setFormData({ nombre: "", precio: "", stock: "" });
      setError("");
    } catch (err) {
      setError("Error al crear el producto.");
    }
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/productos/${editingProduct.id}/`, updatedData);
      setProductos(
        productos.map((prod) =>
          prod.id === editingProduct.id ? { ...prod, ...updatedData } : prod
        )
      );
      setEditingProduct(null);
      setError("");
    } catch (err) {
      setError("Error al actualizar el producto.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;
    try {
      await api.delete(`/productos/${id}/`);
      setProductos(productos.filter((prod) => prod.id !== id));
    } catch (err) {
      setError("Error al eliminar el producto.");
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Productos</h1>

      <form onSubmit={handleCreate} className="mb-6 flex gap-4">
        <input
          type="text"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          placeholder="Nombre del producto"
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          value={formData.precio}
          onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
          placeholder="Precio"
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          value={formData.stock}
          onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
          placeholder="Stock"
          className="border p-2 rounded w-full"
        />
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Agregar
        </button>
      </form>

      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Nombre</th>
            <th className="border border-gray-300 px-4 py-2">Precio</th>
            <th className="border border-gray-300 px-4 py-2">Stock</th>
            <th className="border border-gray-300 px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td className="border border-gray-300 px-4 py-2">{producto.id}</td>
              <td className="border border-gray-300 px-4 py-2">{producto.nombre}</td>
              <td className="border border-gray-300 px-4 py-2">{producto.precio}</td>
              <td className="border border-gray-300 px-4 py-2">{producto.stock}</td>
              <td className="border border-gray-300 px-4 py-2 flex gap-2">
                <button
                  onClick={() => {
                    setEditingProduct(producto);
                    setUpdatedData({
                      nombre: producto.nombre,
                      precio: producto.precio,
                      stock: producto.stock,
                    });
                  }}
                  className="bg-yellow-500 text-white py-1 px-2 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(producto.id)}
                  className="bg-red-500 text-white py-1 px-2 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl mb-4">Editar Producto</h2>
            <input
              type="text"
              value={updatedData.nombre}
              onChange={(e) =>
                setUpdatedData({ ...updatedData, nombre: e.target.value })
              }
              className="border p-2 rounded w-full mb-4"
            />
            <input
              type="number"
              value={updatedData.precio}
              onChange={(e) =>
                setUpdatedData({ ...updatedData, precio: e.target.value })
              }
              className="border p-2 rounded w-full mb-4"
            />
            <input
              type="number"
              value={updatedData.stock}
              onChange={(e) =>
                setUpdatedData({ ...updatedData, stock: e.target.value })
              }
              className="border p-2 rounded w-full mb-4"
            />
            <div className="flex gap-4">
              <button
                onClick={handleUpdate}
                className="bg-green-500 text-white py-2 px-4 rounded"
              >
                Guardar
              </button>
              <button
                onClick={() => setEditingProduct(null)}
                className="bg-red-500 text-white py-2 px-4 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Productos;
