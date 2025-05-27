import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { API_ROUTES } from '@/configs/routes';

export  function useContadorEmpresas() {
  return useQuery({
    queryKey: ['empresas-count'],
    queryFn: async () => {
      const res = await api.get(API_ROUTES.EMPRESAS);
      return res.data?.count ?? 0;
    },
    retry: false,
  });
}