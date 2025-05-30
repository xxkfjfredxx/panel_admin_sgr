import { useNavigate, useParams } from "react-router-dom";
import useUsuariosPorEmpresa from "@/hooks/usuarios/useUsuariosPorEmpresa";
import UsuarioItem from "@/components/usuarios/UsuarioItem";

export default function EmpresaUsuariosPage() {
  const { id: empresaId } = useParams();
  const navigate = useNavigate();
  const { data: usuarios = [], isLoading, isError } = useUsuariosPorEmpresa(empresaId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">
          Usuarios de la Empresa
        </h1>
        <button
          onClick={() => navigate(`/home/empresas/${empresaId}/usuarios/crear`)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
        >
          + Crear Usuario
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
    </div>
  );
}
