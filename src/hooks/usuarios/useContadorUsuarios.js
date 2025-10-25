import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

export  function useContadorUsuarios() {
  return useQuery({
    queryKey: ['usuarios-count'],
    queryFn: async () => {
      try {
        const res = await api.get('/v1/users/');
        return res.data?.count ?? 0;
      } catch (error) {
        console.warn('⚠️ No se pudo cargar usuarios:', error.response?.status);
        return 'no-autorizado';
      }
    },
    retry: false,
  });
}