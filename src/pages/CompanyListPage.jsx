import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEmpresas } from "@/hooks/empresas/useEmpresas";
import { useEliminarEmpresa } from "@/hooks/empresas/useEliminarEmpresa";
import { useRestaurarEmpresa } from "@/hooks/empresas/useRestaurarEmpresa";
import { useEliminarEmpresaDefinitivo } from "@/hooks/empresas/useEliminarEmpresaDefinitivo";

export default function CompanyListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [verEliminadas, setVerEliminadas] = useState(false); // 👈 Usado correctamente

  const { data, isLoading, isError } = useEmpresas({
    page,
    search: query,
    incluir_eliminadas: verEliminadas, // ✅ Aquí lo aplicas
  });

  const eliminarEmpresa = useEliminarEmpresa();
  const restaurarEmpresa = useRestaurarEmpresa();
  const eliminarDefinitivo = useEliminarEmpresaDefinitivo();

  // Ya no necesitas filtrar por is_deleted acá, eso viene del backend
  const empresas = data?.results ?? [];

  const handleEliminar = (id) => {
    if (confirm("¿Estás seguro de eliminar esta empresa?")) {
      eliminarEmpresa.mutate({ id, companyId: id });
    }
  };

  const handleRestaurar = (id) => {
    if (confirm("¿Deseas restaurar esta empresa?")) {
      restaurarEmpresa.mutate({ id, companyId: id });
    }
  };

  const handleEliminarDefinitivo = (id) => {
    if (
      confirm(
        "¿Estás seguro de eliminar esta empresa PERMANENTEMENTE? Esta acción no se puede deshacer."
      )
    ) {
      eliminarDefinitivo.mutate({ id, companyId: id });
    }
  };

  const handleBuscar = () => {
    setPage(1);
    setQuery(search);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">
          Empresas Registradas
        </h1>
        <button
          onClick={() => navigate("/home/empresas/crear")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
        >
          + Crear Empresa
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o NIT"
          className="px-4 py-2 border rounded-md dark:bg-gray-900 dark:text-white"
        />
        <button
          onClick={handleBuscar}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Buscar
        </button>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={verEliminadas}
            onChange={() => setVerEliminadas((prev) => !prev)}
          />
          <span className="text-sm dark:text-white">Ver eliminadas</span>
        </label>
      </div>

      {isLoading && <p>Cargando empresas...</p>}
      {isError && (
        <p className="text-red-500">Error al cargar las empresas.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {empresas.map((empresa) => (
          <div
            key={empresa.id}
            className={`p-5 rounded-xl shadow-md transition-all ${
              empresa.is_deleted
                ? "bg-gray-200 dark:bg-gray-700 opacity-70"
                : "bg-white dark:bg-gray-800 hover:shadow-lg"
            }`}
          >
            <h2 className="text-xl font-semibold">
              {empresa.name}
              {empresa.is_deleted && (
                <span className="ml-2 text-sm text-red-500 font-normal">
                  (Eliminada)
                </span>
              )}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              NIT: {empresa.nit}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {empresa.is_deleted ? (
                <>
                  <button
                    onClick={() => handleRestaurar(empresa.id)}
                    className="text-sm px-3 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                  >
                    Restaurar
                  </button>
                  <button
                    onClick={() => handleEliminarDefinitivo(empresa.id)}
                    className="text-sm px-3 py-1 bg-red-800 text-white rounded hover:bg-red-900"
                  >
                    Eliminar Permanente
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate(`/home/empresas/${empresa.id}`)}
                    className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Ver / Modificar
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/home/empresas/${empresa.id}/usuarios`, {
                        state: { nombreEmpresa: empresa.name },
                      })
                    }
                    className="text-sm px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  >
                    Usuarios
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/home/empresas/${empresa.id}/roles`)
                    }
                    className="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Ver Roles
                  </button>
                  <button
                    onClick={() => handleEliminar(empresa.id)}
                    className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
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
