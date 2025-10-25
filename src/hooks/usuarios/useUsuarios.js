import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';

export  function useUsuarios() {
  return useQuery({
    queryKey: ['usuarios'],
    queryFn: async () => {
      const res = await api.get('/v1/users/');
      return res.data?.results ?? res.data ?? [];
    },
  });
}