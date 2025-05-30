import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

export default function useBuscarEmpresas(query) {
  return useQuery({
    queryKey: ['buscar-empresas', query],
    queryFn: async () => {
      const res = await api.get(`/companies/?search=${query}`);
      return res.data?.results ?? [];
    },
    enabled: !!query && query.length >= 2,
  });
}
