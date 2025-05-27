import { useNavigate } from 'react-router-dom';

export default function ErrorFallback({ error }) {
  const navigate = useNavigate();

  const is404 = error?.response?.status === 404;

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4 px-4">
      <h1 className="text-3xl font-bold text-red-600">¡Ups! Algo salió mal</h1>
      <p className="text-gray-600 dark:text-gray-400">
        {is404
          ? 'No se encontró la empresa solicitada.'
          : 'Ocurrió un error inesperado. Intenta de nuevo.'}
      </p>

      {error?.response?.status && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm">
          {error.response.status} - {error.response.statusText}
        </div>
      )}

      <button
        onClick={() => navigate('/home/empresas')}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition"
      >
        Volver al listado
      </button>
    </div>
  );
}
