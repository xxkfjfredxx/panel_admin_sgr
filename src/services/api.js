// src/services/api.js  (o donde lo tengas)
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/",     // ajusta si usas env vars
});

/* ----------------------------------------------------------------
 * 1) Incluir token SOLO cuando la petición NO sea /login/
 * ---------------------------------------------------------------- */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // url relativa:  ej. "login/"  ‖  "login/?next=%2F"
  const isLogin = /^\/?login\/?(\?.*)?$/i.test(config.url ?? "");

  if (token && !isLogin) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

/* ----------------------------------------------------------------
 * 2) Manejo centralizado de 401 (token caducado / inválido)
 * ---------------------------------------------------------------- */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // Evita loop: no redirige si ya está en login.
    const onLoginPage = window.location.pathname.includes("/login");

    if (status === 401 && !onLoginPage) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/?expired=1";
    }
    return Promise.reject(error);
  }
);

export default api;

