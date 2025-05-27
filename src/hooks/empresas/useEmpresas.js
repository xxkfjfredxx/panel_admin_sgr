import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { API_ROUTES } from '@/configs/routes';

export  function useEmpresas() {
  return useQuery({
    queryKey: ['empresas'],
    queryFn: async () => {
      const res = await api.get(API_ROUTES.EMPRESAS);
      return res.data?.results ?? res.data ?? [];
    },
  });
}






