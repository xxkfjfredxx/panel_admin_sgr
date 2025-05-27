import { useNavigate } from 'react-router-dom';
import { useEmpresas, useEliminarEmpresa } from '@/hooks/useEmpresas';

export default function CompanyListPage() {
  const navigate = useNavigate();
  const { data: empresas = [], isLoading, isError } = useEmpresas();
  const eliminarEmpresa = useEliminarEmpresa();

  const handleEliminar = (id) => {
    if (confirm('¿Estás seguro de eliminar esta empresa?')) {
      eliminarEmpresa.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">Empresas Registradas</h1>
        <button
          onClick={() => navigate('/home/empresas/crear')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
        >
          + Crear Empresa
        </button>
      </div>

      {isLoading && <p>Cargando empresas...</p>}
      {isError && <p className="text-red-500">Error al cargar las empresas.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {empresas.map((empresa) => (
          <div
            key={empresa.id}
            className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            <h2 className="text-xl font-semibold">{empresa.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">NIT: {empresa.nit}</p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => navigate(`/home/empresas/${empresa.id}`)}
                className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Ver / Modificar
              </button>
              <button
                onClick={() => handleEliminar(empresa.id)}
                className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
