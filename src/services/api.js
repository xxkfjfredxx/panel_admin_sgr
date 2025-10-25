// src/services/api.js
import axios from "axios";
import { API_ROUTES } from "@/configs/routes";

// Puedes mover esto a .env si quieres
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:8000/api/";

// Helpers
function readCookie(name) {
  // lee cookies no-httpOnly (para CSRF doble-submit)
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : null;
}

function setCookie(name, value, { days = 7, path = "/", sameSite = "Lax", secure = false } = {}) {
  const d = new Date();
  d.setTime(d.getTime() + days * 86400 * 1000);
  document.cookie =
    `${name}=${encodeURIComponent(value)}; Expires=${d.toUTCString()}; Path=${path}; SameSite=${sameSite}` +
    (secure ? "; Secure" : "");
}

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false, // usamos Authorization, no cookies httpOnly aquí
});

// ---- REQUEST: añade Authorization, X-Active-Company y X-CSRF-Token en mutaciones
api.interceptors.request.use((config) => {
  const url = (config.url || "").replace(/^\//, ""); // normaliza
  const isAuthPath =
    url.startsWith(API_ROUTES.LOGIN) ||
    url.startsWith(API_ROUTES.REFRESH) ||
    url.startsWith("auth/otp/");

  // Authorization
  const access = localStorage.getItem("access_token");
  if (access && !isAuthPath) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = `Bearer ${access}`;
  }

  // Empresa activa
  const companyId = localStorage.getItem("company_id");
  if (companyId) {
    config.headers = config.headers || {};
    config.headers["X-Active-Company"] = companyId;
  }

  // CSRF doble-submit (solo mutaciones y solo si lo pides en backend)
  const method = (config.method || "get").toLowerCase();
  const needsCsrf = ["post", "put", "patch", "delete"].includes(method);
  if (needsCsrf && !isAuthPath) {
    const csrf = readCookie("csrf_token");
    if (csrf) {
      config.headers = config.headers || {};
      config.headers["X-CSRF-Token"] = csrf;
    }
  }

  return config;
});

// ---- RESPONSE: 401 -> intenta refresh; si falla, limpia y redirige a /login
let refreshing = null;

async function doRefresh() {
  if (!refreshing) {
    const refresh = localStorage.getItem("refresh_token");
    if (!refresh) return null;

    refreshing = axios
      .post(`${BASE_URL}${API_ROUTES.REFRESH}`, { refresh }, { withCredentials: false })
      .then((r) => r.data)
      .catch(() => null)
      .finally(() => {
        setTimeout(() => (refreshing = null), 0);
      });
  }
  return refreshing;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    const status = response?.status;

    // Si no hay response o no es 401, fuera
    if (!status || status !== 401) {
      return Promise.reject(error);
    }

    // Evita loop si el 401 viene del propio refresh o login
    const url = (config?.url || "").replace(/^\//, "");
    if (url.startsWith(API_ROUTES.REFRESH) || url.startsWith(API_ROUTES.LOGIN)) {
      // Sesión inválida definitivamente
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("token"); // legacy si existiera
      localStorage.removeItem("user");
      // borra cookie csrf (no httpOnly) y company
      setCookie("csrf_token", "", { days: -1 });
      localStorage.removeItem("company_id");
      localStorage.removeItem("company_name");

      // redirige limpio
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    // Intenta refresh rotativo
    const data = await doRefresh();
    if (!data || !data.access) {
      // refresh inválido → logout
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setCookie("csrf_token", "", { days: -1 });
      localStorage.removeItem("company_id");
      localStorage.removeItem("company_name");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    // Guarda nuevo access y, si vino, nuevo refresh (rotación)
    localStorage.setItem("access_token", data.access);
    if (data.refresh) {
      localStorage.setItem("refresh_token", data.refresh);
    }

    // Reintenta el request original con el access nuevo
    const retry = { ...config };
    retry.headers = { ...(retry.headers || {}), Authorization: `Bearer ${data.access}` };
    return api.request(retry);
  }
);

export default api;
