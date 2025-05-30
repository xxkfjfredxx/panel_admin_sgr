import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

// Solo mostrar usuarios con roles importantes
const ROLES_IMPORTANTES = ['admin', 'siso', 'oficinista'];

export default function useUsuariosPorEmpresa(empresaId) {
  return useQuery({
    queryKey: ['usuarios-empresa', empresaId],
    queryFn: async () => {
      const res = await api.get(`/users/?empresa=${empresaId}`);
      const todos = res.data?.results ?? [];
      return todos.filter((u) =>
        u.role &&
        ROLES_IMPORTANTES.includes(u.role.name.toLowerCase())
      );
    },
    enabled: !!empresaId,
  });
}
