import { useState, useEffect } from "react"
import api from "../api/api"

const Categorias = () => {
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    api.get("/categorias/")
      .then((response) => {
        setCategorias(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error al cargar las categorías");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando...</p>
  if (error) return <p>{error}</p>

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Categorias</h1>
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border boder-gray-300 px-4 py-8">ID</th>
            <th className="border boder-gray-300 px-4 py-8">Nombre</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((categoria) =>(
            <tr>
              <td className="border border-gray-300 px-4 py-2">{categoria.id}</td>
              <td className="border border-gray-300 px-4 py-2">{categoria.nombre}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Categorias
