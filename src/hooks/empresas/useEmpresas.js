import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { API_ROUTES } from '@/configs/routes';

export function useEmpresas({ page = 1, search = '' }) {
  return useQuery({
    queryKey: ['empresas', page, search],
    queryFn: async () => {
      const res = await api.get(API_ROUTES.EMPRESAS, {
        params: { page, search }
      });
      return res.data;
    },
    keepPreviousData: true,
  });
}
