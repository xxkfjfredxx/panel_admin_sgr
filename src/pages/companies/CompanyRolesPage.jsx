import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import api from '@/services/api';

const PERMISOS = [
  'view_dashboard',
  'edit_users',
  'manage_roles',
  'access_reports',
  'edit_company_data',
];

const NIVELES_ACCESO = [
  { value: 1, label: 'Bajo' },
  { value: 2, label: 'Medio' },
  { value: 3, label: 'Alto' },
];

export default function CompanyRolesPage() {
  const { id: companyId } = useParams();
  const queryClient = useQueryClient();

  const { data: roles = [], isLoading } = useQuery({
    queryKey: ['roles', companyId],
    queryFn: async () => {
      const res = await api.get(`/user-roles/?empresa=${companyId}`);
      return res.data?.results ?? [];
    },
  });

  const [form, setForm] = useState({
    name: '',
    description: '',
    permissions: [],
    access_level: 1,
  });
  const [editingId, setEditingId] = useState(null);

  const crearRol = useMutation({
    mutationFn: (data) => api.post('/user-roles/', { ...data, company: companyId }),
    onSuccess: () => {
      queryClient.invalidateQueries(['roles', companyId]);
      setForm({ name: '', description: '', permissions: [], access_level: 1 });
    },
  });

  const editarRol = useMutation({
    mutationFn: ({ id, data }) => api.patch(`/user-roles/${id}/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['roles', companyId]);
      setEditingId(null);
    },
  });

  const eliminarRol = useMutation({
    mutationFn: (id) => api.delete(`/user-roles/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries(['roles', companyId]);
    },
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePermiso = (permiso) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permiso)
        ? prev.permissions.filter((p) => p !== permiso)
        : [...prev.permissions, permiso],
    }));
  };

  const handleGuardar = () => {
    if (editingId) {
      editarRol.mutate({ id: editingId, data: form });
    } else {
      crearRol.mutate(form);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">
        Company Roles
      </h1>

      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow space-y-3">
        <input
          name="name"
          placeholder="Role name"
          value={form.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded dark:bg-gray-900 dark:text-white"
        />

        <textarea
          name="description"
          placeholder="Description (optional)"
          value={form.description}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded dark:bg-gray-900 dark:text-white"
        />

        <div>
          <label className="block font-semibold mb-1">Nivel de acceso</label>
          <select
            name="access_level"
            value={form.access_level}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded dark:bg-gray-900 dark:text-white"
          >
            {NIVELES_ACCESO.map((nivel) => (
              <option key={nivel.value} value={nivel.value}>{nivel.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1">Permisos</label>
          <div className="flex flex-wrap gap-3">
            {PERMISOS.map((permiso) => (
              <label key={permiso} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.permissions.includes(permiso)}
                  onChange={() => togglePermiso(permiso)}
                />
                <span className="text-sm">{permiso}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleGuardar}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          {editingId ? 'Update Role' : 'Create Role'}
        </button>
      </div>

      {isLoading ? (
        <p>Cargando roles...</p>
      ) : (
        <ul className="space-y-2">
          {roles.map((rol) => (
            <li key={rol.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow flex justify-between items-center">
              <div>
                <p className="font-semibold">{rol.name}</p>
                <p className="text-sm text-gray-500">{rol.description || 'Sin descripción'}</p>
                <p className="text-xs text-gray-400">Nivel de acceso: {rol.access_level ?? 'N/A'}</p>
                <p className="text-xs text-gray-400">
                  Permisos: {Array.isArray(rol.permissions) ? rol.permissions.join(', ') : 'Ninguno'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingId(rol.id);
                    setForm({
                      name: rol.name,
                      description: rol.description || '',
                      permissions: rol.permissions || [],
                      access_level: rol.access_level || 1,
                    });
                  }}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm('¿Eliminar este rol?')) {
                      eliminarRol.mutate(rol.id);
                    }
                  }}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
