import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCrearUsuario, useCrearRol, useRolesPorEmpresa } from "@/hooks/usuarios";

export default function RegisterUserPage() {
  const { id: empresaId } = useParams();
  const navigate = useNavigate();
  const crearUsuario = useCrearUsuario();
  const crearRol = useCrearRol();
  const { data: roles = [] } = useRolesPorEmpresa(empresaId);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    role: "", // almacena el ID del rol
  });

  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoRol, setNuevoRol] = useState({ name: "", description: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { role, ...rest } = form;
    const payload = { ...rest, role_id: role }; // 👈 corregido aquí

    crearUsuario.mutate(payload, {
      onSuccess: () => navigate(`/home/empresas/${empresaId}/usuarios`),
      onError: () => alert("Error al crear el usuario."),
    });
  };

  const handleCrearRol = () => {
    crearRol.mutate(
      { ...nuevoRol, company: empresaId },
      {
        onSuccess: (res) => {
          setForm({ ...form, role: res.data.id });
          setNuevoRol({ name: "", description: "" });
          setMostrarModal(false);
        },
        onError: () => alert("No se pudo crear el rol."),
      }
    );
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
          <label className="block text-sm mb-1">Rol</label>
          <div className="flex gap-2">
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
            {roles.length === 0 && (
              <button
                type="button"
                onClick={() => setMostrarModal(true)}
                className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm"
              >
                + Rol
              </button>
            )}
          </div>
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

      {mostrarModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Nuevo Rol</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Nombre</label>
                <input
                  type="text"
                  value={nuevoRol.name}
                  onChange={(e) =>
                    setNuevoRol({ ...nuevoRol, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-md dark:bg-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Descripción</label>
                <textarea
                  value={nuevoRol.description}
                  onChange={(e) =>
                    setNuevoRol({ ...nuevoRol, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-md dark:bg-gray-900 dark:text-white"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setMostrarModal(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-md"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCrearRol}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md"
                >
                  Crear Rol
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
