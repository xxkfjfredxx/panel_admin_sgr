import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

export default function useCrearRol() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (nuevoRol) => api.post('/user-roles/', nuevoRol),
    onSuccess: (_, nuevoRol) => {
      queryClient.invalidateQueries({ queryKey: ['roles-empresa', nuevoRol.company] });
    },
  });
}
