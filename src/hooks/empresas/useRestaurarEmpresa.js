import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { API_ROUTES } from '@/configs/routes';

export function useRestaurarEmpresa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, companyId }) =>
      api.post(`${API_ROUTES.EMPRESAS}${id}/restore/`, null, {
        headers: {
          'X-Active-Company': companyId,
        },
      }),
    onSuccess: () => {
      // Refresca los datos de la lista de empresas
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      queryClient.invalidateQueries({ queryKey: ['empresas-count'] });
    },
    retry: false,
  });
}
