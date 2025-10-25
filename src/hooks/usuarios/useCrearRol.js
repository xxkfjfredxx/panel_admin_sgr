import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

export default function useCrearRol() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (nuevoRol) => {
      if (!nuevoRol.company) {
        throw new Error("El rol debe incluir la empresa (company).");
      }
      return api.post('/v1/user-roles/', nuevoRol);
    },

    onSuccess: (_, nuevoRol) => {
      queryClient.invalidateQueries({ queryKey: ['roles-empresa', nuevoRol.company] });
    },
  });
}
