import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: true, // Asegura que las cookies sean enviadas
});

// Función para obtener el token CSRF de las cookies
const getCSRFToken = () => {
  const name = "csrftoken";
  const cookies = document.cookie.split("; ");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].split("=");
    if (cookie[0] === name) return decodeURIComponent(cookie[1]);
  }
  return null;
};

// Interceptor para añadir el token CSRF en cada solicitud
api.interceptors.request.use((config) => {
  const csrftoken = getCSRFToken();
  if (csrftoken) {
    config.headers["X-CSRFToken"] = csrftoken;
  }
  return config;
});

export default api;
