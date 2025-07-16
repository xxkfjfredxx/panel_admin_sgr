import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { API_ROUTES } from '@/configs/routes';

export function useEliminarEmpresaDefinitivo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, companyId }) =>
      api.delete(`${API_ROUTES.EMPRESAS}${id}/eliminar-definitivo/`, {
        headers: {
          'X-Active-Company': companyId,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      queryClient.invalidateQueries({ queryKey: ['empresas-count'] });
    },
    retry: false,
  });
}
