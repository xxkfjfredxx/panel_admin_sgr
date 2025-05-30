import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

const ROLES_IMPORTANTES = ['admin', 'siso', 'oficinista'];

export default function useUsuariosPorEmpresa({ empresaId, page = 1, search = '' }) {
  return useQuery({
    queryKey: ['usuarios-empresa', empresaId, page, search],
    queryFn: async () => {
      const res = await api.get('/users/', {
        params: { empresa: empresaId, page, search }
      });

      // filtramos solo roles importantes
      const filtrados = (res.data?.results ?? []).filter((u) =>
        u.role && ROLES_IMPORTANTES.includes(u.role.name.toLowerCase())
      );

      // devolvemos paginado pero con los resultados filtrados
      return {
        ...res.data,
        results: filtrados
      };
    },
    enabled: !!empresaId,
    keepPreviousData: true,
  });
}
