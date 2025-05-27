import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

export  function useCrearUsuario() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (nuevoUsuario) => api.post('/users/', nuevoUsuario),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios'] });
    },
  });
}