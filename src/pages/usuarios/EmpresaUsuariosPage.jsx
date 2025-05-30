import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useUsuariosPorEmpresa from "@/hooks/usuarios/useUsuariosPorEmpresa";
import UsuarioItem from "@/components/usuarios/UsuarioItem";

export default function EmpresaUsuariosPage() {
  const { id: empresaId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const nombreEmpresa = location.state?.nombreEmpresa;

  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useUsuariosPorEmpresa({ empresaId, page, search: query });
  const usuarios = data?.results || [];

  const handleBuscar = () => {
    setPage(1);
    setQuery(search);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">
          Usuarios de {nombreEmpresa || 'la Empresa'}
        </h1>
        <button
          onClick={() => navigate(`/home/empresas/${empresaId}/usuarios/crear`)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
        >
          + Crear Usuario
        </button>
      </div>

      <div className="flex gap-2 items-center">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, usuario o correo"
          className="px-4 py-2 border rounded-md dark:bg-gray-900 dark:text-white"
        />
        <button
          onClick={handleBuscar}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Buscar
        </button>
      </div>

      {isLoading && <p>Cargando usuarios...</p>}
      {isError && <p className="text-red-500">Error al cargar los usuarios.</p>}

      <div className="space-y-3">
        {usuarios.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No hay usuarios registrados.</p>
        ) : (
          usuarios.map((usuario) => (
            <UsuarioItem key={usuario.id} usuario={usuario} />
          ))
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={!data?.previous}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
        >
          Página anterior
        </button>
        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={!data?.next}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
        >
          Página siguiente
        </button>
      </div>
    </div>
  );
}
