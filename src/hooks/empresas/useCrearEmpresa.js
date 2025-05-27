import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { API_ROUTES } from '@/configs/routes';

export  function useCrearEmpresa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (nuevaEmpresa) => api.post(API_ROUTES.EMPRESAS, nuevaEmpresa),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
    },
  });
}