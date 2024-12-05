import { useState, useEffect } from "react";
import api, { setAuthToken } from "../api/api";

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nombre, setNombre] = useState(""); // Para crear una nueva categoría
  const [editingCategory, setEditingCategory] = useState(null); // Para editar una categoría
  const [updatedName, setUpdatedName] = useState(""); // Para almacenar el nombre editado

  // Cargar las categorías al montar el componente
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setAuthToken(token); // Configura el token en Axios
    } else {
      setError("No estás autenticado. Inicia sesión para continuar.");
      setLoading(false);
      return;
    }

    api.get("/categorias/")
      .then((response) => {
        setCategorias(response.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          setError("No tienes permisos para ver las categorías. Inicia sesión nuevamente.");
        } else {
          setError("Error al cargar las categorías.");
        }
        setLoading(false);
      });
  }, []);

  // Crear una nueva categoría
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setError("El nombre de la categoría es obligatorio.");
      return;
    }
    try {
      const response = await api.post("/categorias/", { nombre });
      setCategorias([...categorias, response.data]);
      setNombre(""); // Limpia el formulario
      setError("");
    } catch (err) {
      setError("Error al crear la categoría.");
    }
  };

  // Guardar cambios en una categoría existente
  const handleUpdate = async () => {
    if (!updatedName.trim()) {
      setError("El nombre no puede estar vacío.");
      return;
    }
    try {
      await api.put(`/categorias/${editingCategory.id}/`, { nombre: updatedName });
      setCategorias(
        categorias.map((cat) =>
          cat.id === editingCategory.id ? { ...cat, nombre: updatedName } : cat
        )
      );
      setEditingCategory(null);
      setError("");
    } catch (err) {
      setError("Error al actualizar la categoría.");
    }
  };

  // Eliminar una categoría
  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar esta categoría?")) return;
    try {
      await api.delete(`/categorias/${id}/`);
      setCategorias(categorias.filter((cat) => cat.id !== id));
    } catch (err) {
      setError("Error al eliminar la categoría.");
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Categorías</h1>

      {/* Formulario para crear una nueva categoría */}
      <form onSubmit={handleCreate} className="mb-6 flex gap-4">
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre de la categoría"
          className="border p-2 rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded"
        >
          Agregar
        </button>
      </form>

      {/* Tabla de categorías */}
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2">ID</th>
            <th className="border border-gray-300 px-4 py-2">Nombre</th>
            <th className="border border-gray-300 px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((categoria) => (
            <tr key={categoria.id}>
              <td className="border border-gray-300 px-4 py-2">{categoria.id}</td>
              <td className="border border-gray-300 px-4 py-2">{categoria.nombre}</td>
              <td className="border border-gray-300 px-4 py-2 flex gap-2">
                <button
                  onClick={() => {
                    setEditingCategory(categoria);
                    setUpdatedName(categoria.nombre);
                  }}
                  className="bg-yellow-500 text-white py-1 px-2 rounded"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(categoria.id)}
                  className="bg-red-500 text-white py-1 px-2 rounded"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para editar categoría */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-xl mb-4">Editar Categoría</h2>
            <input
              type="text"
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
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
                onClick={() => setEditingCategory(null)}
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

export default Categorias;
