import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { API_ROUTES } from '@/configs/routes';

export function useEmpresas() {
  return useQuery({
    queryKey: ['empresas'],
    queryFn: async () => {
      const res = await api.get('/companies/');
      return res.data.results;
    }
  });
}

export function useContadorEmpresas() {
  return useQuery({
    queryKey: ['empresas-count'],
    queryFn: async () => {
      const res = await api.get(API_ROUTES.EMPRESAS);
      return res.data?.count ?? 0;
    },
    retry: false,
  });
}


export function useCrearEmpresa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (nuevaEmpresa) => api.post(API_ROUTES.EMPRESAS, nuevaEmpresa),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
    },
  });
}

export function useEliminarEmpresa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`${API_ROUTES.EMPRESAS}${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
    },
  });
}
