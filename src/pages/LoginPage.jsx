import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import { API_ROUTES } from "@/configs/routes";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");    // seguimos usando email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // ⇨ usa la ruta correcta del backend vía tu api.js
      const res = await api.post(API_ROUTES.LOGIN, { email, password });
      const { access, refresh, token, company_id, company_name, user } = res.data || {};

      // Tokens (access/refresh). 'token' es legacy si tu backend aún lo manda.
      if (access)  localStorage.setItem("access_token", access);
      if (refresh) localStorage.setItem("refresh_token", refresh);
      if (token)   localStorage.setItem("token", token);

      // Contexto de empresa (lo exige tu middleware por X-Active-Company)
      if (company_id != null)   localStorage.setItem("company_id", String(company_id));
      if (company_name != null) localStorage.setItem("company_name", String(company_name));

      // Usuario (si lo usas en el cliente)
      if (user) localStorage.setItem("user", JSON.stringify(user));

      // CSRF doble-submit para mutaciones (cookie NO httpOnly)
      const csrf = cryptoRandomHex(32);
      setCookie("csrf_token", csrf, {
        days: 7,
        sameSite: "Lax",
        secure: window.location.protocol === "https:",
      });

      // Redirige a tu home del panel
      navigate("/home", { replace: true });
    } catch (err) {
      const detail =
        err?.response?.data?.detail ||
        (err?.response?.status === 401 ? "Usuario o contraseña incorrectos." : "No fue posible iniciar sesión.");
      setError(detail);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-100 to-blue-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-indigo-700 dark:text-white">SGR Panel Global</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Ingresa como administrador para gestionar tus empresas
          </p>
        </div>

        {error && (
          <div className="text-red-600 text-sm text-center bg-red-100 border border-red-300 p-2 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ej. usuario@dominio.com"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-gray-800 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-gray-800 dark:text-white"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200"
          >
            Iniciar sesión
          </button>
        </form>

        <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-6">
          © {new Date().getFullYear()} TuEmpresa. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}

/* ===== helpers locales (sin tocar diseño) ===== */
function setCookie(name, value, { days = 7, path = "/", sameSite = "Lax", secure = false } = {}) {
  const d = new Date();
  d.setTime(d.getTime() + days * 86400 * 1000);
  document.cookie =
    `${name}=${encodeURIComponent(value)}; Expires=${d.toUTCString()}; Path=${path}; SameSite=${sameSite}` +
    (secure ? "; Secure" : "");
}

function cryptoRandomHex(len = 32) {
  const arr = new Uint8Array(len / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (b) => b.toString(16).padStart(2, "0")).join("");
}
