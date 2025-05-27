import { useContadorEmpresas } from "@/hooks/empresas/useContadorEmpresas";
import { useContadorUsuarios } from "@/hooks/usuarios/useContadorUsuarios";

export default function HomePage() {
  const {
    data: totalEmpresas,
    isLoading: cargandoEmpresas,
    isError: errorEmpresas,
  } = useContadorEmpresas();

  const {
    data: totalUsuarios,
    isLoading: cargandoUsuarios,
    isError: errorUsuarios,
  } = useContadorUsuarios();

  const cargando = cargandoEmpresas || cargandoUsuarios;
  const error = errorEmpresas || errorUsuarios;

  if (cargando)
    return <p className="text-center mt-10">Cargando dashboard...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400">
        Bienvenido al Panel Global
      </h1>
      <p className="text-gray-600 dark:text-gray-300">
        Desde aquí puedes administrar múltiples empresas y gestionar sus
        accesos.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Empresas */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
          <h2 className="text-xl font-semibold">Empresas registradas</h2>
          <p className="text-2xl font-bold mt-2">
            {errorEmpresas ? "❌ Error" : totalEmpresas ?? "—"}
          </p>
        </div>

        {/* Usuarios */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
          <h2 className="text-xl font-semibold">Usuarios activos</h2>
          <p className="text-2xl font-bold mt-2">
            {cargandoUsuarios
              ? "Cargando..."
              : totalUsuarios === "no-autorizado"
              ? "🔒 Sin acceso"
              : totalUsuarios ?? "—"}
          </p>
        </div>

        {/* Último acceso (mock) */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
          <h2 className="text-xl font-semibold">Último acceso</h2>
          <p className="text-md mt-2 text-gray-500 dark:text-gray-400">
            Hace 5 minutos
          </p>
        </div>
      </div>
    </div>
  );
}
