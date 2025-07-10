import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';

export default function UsuarioItem({ usuario, empresaId }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({
    username: usuario.username,
    email: usuario.email,
    first_name: usuario.first_name,
    last_name: usuario.last_name,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    try {
      await api.patch(`/users/${usuario.id}/`, form, {
        headers: {
          'X-Active-Company': empresaId,
        },
      });
      queryClient.invalidateQueries(['usuarios']);
      setEditando(false);
    } catch (error) {
      alert('Error al guardar los cambios.');
    }
  };

  const handleEliminar = async () => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    try {
      await api.delete(`/users/${usuario.id}/`, {
        headers: {
          'X-Active-Company': empresaId,
        },
      });
      queryClient.invalidateQueries(['usuarios']);
    } catch (error) {
      alert('Error al eliminar el usuario.');
    }
  };

  return (
    <div className="border p-4 rounded mb-2 bg-white dark:bg-gray-800">
      {editando ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {['username', 'email', 'first_name', 'last_name'].map((campo) => (
            <input
              key={campo}
              name={campo}
              value={form[campo]}
              onChange={handleChange}
              placeholder={campo}
              className="px-2 py-1 border rounded dark:bg-gray-900 dark:text-white"
            />
          ))}
          <div className="flex gap-2 col-span-full justify-end">
            <button
              onClick={handleGuardar}
              className="px-3 py-1 bg-green-600 text-white rounded"
            >
              Guardar
            </button>
            <button
              onClick={() => setEditando(false)}
              className="px-3 py-1 bg-gray-400 text-black rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <div>
            <p className="font-semibold">{usuario.username}</p>
            <p className="text-sm">{usuario.email}</p>
            <p className="text-sm italic">
              {usuario.first_name} {usuario.last_name}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() =>
                navigate(`/home/usuarios/${usuario.id}`, {
                  state: { empresaId }, // ← Enviamos empresa activa
                })
              }
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              Ver detalles
            </button>
            <button
              onClick={() => setEditando(true)}
              className="px-3 py-1 bg-yellow-500 text-white rounded"
            >
              Editar
            </button>
            <button
              onClick={handleEliminar}
              className="px-3 py-1 bg-red-600 text-white rounded"
            >
              Eliminar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
