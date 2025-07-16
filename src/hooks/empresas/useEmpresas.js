import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';
import { API_ROUTES } from '@/configs/routes';

export const useEmpresas = ({ page = 1, search = "", incluir_eliminadas = false, companyId }) => {
  return useQuery({
    queryKey: ["empresas", page, search, incluir_eliminadas],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", page);
      if (search) params.append("search", search);
      if (incluir_eliminadas) params.append("incluir_eliminadas", "true");

      const res = await api.get(`${API_ROUTES.EMPRESAS}?${params.toString()}`, {
        headers: {
          'X-Active-Company': companyId, // 👈 Aquí lo envías
        },
      });

      return res.data;
    },
  });
};
