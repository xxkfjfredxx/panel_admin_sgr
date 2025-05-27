import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { API_ROUTES } from '@/configs/routes';

export  function useEliminarEmpresa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`${API_ROUTES.EMPRESAS}${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
    },
  });
}