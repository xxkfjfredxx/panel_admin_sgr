import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

export function useCrearUsuario(empresaId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (nuevoUsuario) =>
      api.post('/users/', nuevoUsuario, {
        headers: {
          'X-Active-Company': String(empresaId),
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['usuarios-empresa', empresaId],
      });
    },
  });
}
