import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:8000/api/", // O usa import.meta.env.VITE_API_BASE
});

// Incluir token en cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Manejo de 401 (sin redirección agresiva)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/?expired=1";
    }
    return Promise.reject(error);
  }
);

export default api;
