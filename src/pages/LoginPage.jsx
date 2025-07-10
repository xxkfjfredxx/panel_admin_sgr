import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");  // Cambié de username a email
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Enviar email en lugar de username
      const res = await api.post("/login/", { email, password });

      const { token, user } = res.data;

      // ✅ Guardar en localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Redirigir al dashboard
      navigate("/home");
    } catch (err) {
      setError("Usuario o contraseña incorrectos.");
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo electrónico</label> {/* Cambié de Usuario a Correo electrónico */}
            <input
              type="email"  // Cambié a tipo email para validación automática
              value={email}
              onChange={(e) => setEmail(e.target.value)}  // Cambié de setUsername a setEmail
              placeholder="Ej. usuario@dominio.com"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:bg-gray-800 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña</label>
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
