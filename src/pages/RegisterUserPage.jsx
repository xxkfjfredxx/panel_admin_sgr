import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCrearUsuario,useRoles } from '@/hooks/usuarios';
import { useEmpresas,} from "@/hooks/empresas";

export default function RegisterUserPage() {
  const navigate = useNavigate();
  const crearUsuario = useCrearUsuario();
  const { data: empresas = [] } = useEmpresas();
  const { data: roles = [] } = useRoles();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    company: "",
    role: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    crearUsuario.mutate(form, {
      onSuccess: () => navigate("/home/usuarios"),
      onError: () => alert("Error al crear el usuario."),
    });
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">
        Crear Usuario
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow"
      >
        {["username", "email", "first_name", "last_name", "password"].map(
          (field) => (
            <div key={field}>
              <label className="block text-sm mb-1 capitalize">
                {field.replace("_", " ")}
              </label>
              <input
                type={field === "password" ? "password" : "text"}
                name={field}
                value={form[field]}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md dark:bg-gray-900 dark:text-white"
                required
              />
            </div>
          )
        )}

        <div>
          <label className="block text-sm mb-1">Empresa</label>
          <select
            name="company"
            value={form.company}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md dark:bg-gray-900 dark:text-white"
            required
          >
            <option value="">Seleccionar empresa</option>
            {empresas.map((empresa) => (
              <option key={empresa.id} value={empresa.id}>
                {empresa.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">Rol</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md dark:bg-gray-900 dark:text-white"
            required
          >
            <option value="">Seleccionar rol</option>
            {roles.map((rol) => (
              <option key={rol.id} value={rol.id}>
                {rol.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={crearUsuario.isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
          >
            {crearUsuario.isLoading ? "Guardando..." : "Crear Usuario"}
          </button>
        </div>
      </form>
    </div>
  );
}
