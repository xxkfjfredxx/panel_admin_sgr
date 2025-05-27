import { useNavigate } from "react-router-dom";
import { useUsuarios } from "@/hooks/usuarios/useUsuarios";

export default function UserListPage() {
  const navigate = useNavigate();
  const { data: usuarios = [], isLoading, isError } = useUsuarios();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">
          Usuarios
        </h1>
        <button
          onClick={() => navigate("/home/usuarios/crear")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
        >
          + Crear Usuario
        </button>
      </div>

      {isLoading && <p>Cargando usuarios...</p>}
      {isError && <p className="text-red-500">Error al cargar usuarios.</p>}

      <ul className="space-y-2">
        {usuarios.map((usuario) => (
          <li
            key={usuario.id}
            className="p-4 bg-white dark:bg-gray-800 rounded shadow"
          >
            <p className="font-semibold">{usuario.username}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {usuario.email}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
