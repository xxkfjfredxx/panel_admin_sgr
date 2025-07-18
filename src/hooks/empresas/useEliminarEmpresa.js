import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { API_ROUTES } from '@/configs/routes';

export function useEliminarEmpresa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, companyId }) =>
      api.delete(`${API_ROUTES.EMPRESAS}${id}/`, {
        headers: {
          'X-Active-Company': companyId,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
    },
  });
}
