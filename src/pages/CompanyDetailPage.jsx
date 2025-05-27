import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { API_ROUTES } from '@/configs/routes';
import ErrorFallback from '@/components/ErrorFallback';

export default function CompanyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['empresa', id],
    queryFn: async () => {
      const res = await api.get(`${API_ROUTES.EMPRESAS}${id}/`);
      return res.data;
    },
  });

  const updateEmpresa = useMutation({
    mutationFn: (datos) => api.put(`${API_ROUTES.EMPRESAS}${id}/`, datos),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresa', id] });
      alert('Empresa actualizada correctamente');
    },
  });

  const [form, setForm] = useState({
    name: '',
    nit: '',
    address: '',
    phone: '',
    email: '',
    sector: '',
  });

  useEffect(() => {
    if (data) {
      setForm({
        name: data.name || '',
        nit: data.nit || '',
        address: data.address || '',
        phone: data.phone || '',
        email: data.email || '',
        sector: data.sector || '',
      });
    }
  }, [data]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateEmpresa.mutate(form);
  };

  if (isLoading) return <p>Cargando empresa...</p>;
  if (isError) return <ErrorFallback error={error} />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">
        Detalles de Empresa
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        {['name', 'nit', 'address', 'phone', 'email', 'sector'].map((field) => (
          <div key={field}>
            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300 capitalize">
              {field}
            </label>
            <input
              type="text"
              name={field}
              value={form[field]}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md dark:bg-gray-900 dark:text-white"
            />
          </div>
        ))}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-900 px-4 py-2 rounded-md"
          >
            Volver
          </button>
          <button
            type="submit"
            disabled={updateEmpresa.isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            {updateEmpresa.isLoading ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}
