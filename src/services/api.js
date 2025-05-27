import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:8000/api/", // O usa import.meta.env.VITE_API_BASE
});

// Interceptor para incluir el token en cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  const empresaId = localStorage.getItem("empresaActivaId");
  if (empresaId) {
    config.headers["X-Active-Company"] = empresaId;
  }

  return config;
});

// Interceptor para manejar errores 401 y cerrar sesión
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("empresaActivaId");
      localStorage.removeItem("user");

      window.location.href = '/?expired=1';
    }
    return Promise.reject(error);
  }
);

export default api;
