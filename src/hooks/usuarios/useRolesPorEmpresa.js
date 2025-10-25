import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

export default function useRolesPorEmpresa(empresaId) {
  return useQuery({
    queryKey: ['roles-empresa', empresaId],
    queryFn: async () => {
      const res = await api.get(`/v1/user-roles/?empresa=${empresaId}`);
      return res.data?.results ?? [];
    },
    enabled: !!empresaId,
  });
}
