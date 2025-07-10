import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

export default function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const empresaId = location.state?.empresaId;

  const { data: usuario, isLoading, isError } = useQuery({
    queryKey: ['usuario', id],
    queryFn: async () => {
      const res = await api.get(`/users/${id}/`, {
        headers: {
          'X-Active-Company': empresaId  // 👈 aquí se lo mandas al backend
        }
      });
      return res.data;
    },
  });

  if (isLoading) return <p>Cargando...</p>;
  if (isError || !usuario) return <p>Error al cargar el usuario.</p>;

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400 mb-4">
        Detalles del Usuario
      </h1>

      <div className="space-y-2">
        <p><strong>Nombre de usuario:</strong> {usuario.username}</p>
        <p><strong>Email:</strong> {usuario.email}</p>
        <p><strong>Nombre:</strong> {usuario.first_name} {usuario.last_name}</p>
        <p><strong>Rol:</strong> {usuario.role?.name ?? 'Sin rol'}</p>
        <p><strong>Activo:</strong> {usuario.is_active ? 'Sí' : 'No'}</p>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-md"
        >
          Volver
        </button>
      </div>
    </div>
  );
}
