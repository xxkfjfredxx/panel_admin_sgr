import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

const ROLES_IMPORTANTES = ['admin', 'siso', 'oficinista'];

export default function useUsuariosPorEmpresa({ empresaId, page = 1, search = '', includeDeleted = false }) {
  return useQuery({
    queryKey: ['usuarios-empresa', empresaId, page, search, includeDeleted],
    queryFn: async () => {
      const res = await api.get('/v1/users/', {
        params: {
          empresa: empresaId,
          page,
          search,
          incluir_eliminados: includeDeleted, // 👈 importante
        },
        headers: {
          'X-Active-Company': empresaId,
        },
      });

      const filtrados = (res.data?.results ?? []).filter((u) =>
        u.role && ROLES_IMPORTANTES.includes(u.role.name.toLowerCase())
      );

      return {
        ...res.data,
        results: filtrados,
      };
    },
    enabled: !!empresaId,
    keepPreviousData: true,
  });
}

