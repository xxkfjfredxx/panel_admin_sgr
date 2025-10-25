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
      await api.patch(`/v1/users/${usuario.id}/`, form, {
        headers: { 'X-Active-Company': empresaId },
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
      await api.delete(`/v1/users/${usuario.id}/`, {
        headers: { 'X-Active-Company': empresaId },
      });
      queryClient.invalidateQueries(['usuarios']);
    } catch (error) {
      alert('Error al eliminar el usuario.');
    }
  };

  const handleRestaurar = async () => {
    try {
      await api.post(`/v1/users/${usuario.id}/restaurar/`, {}, {
        headers: { 'X-Active-Company': empresaId },
      });
      queryClient.invalidateQueries(['usuarios']);
    } catch (error) {
      alert('Error al restaurar el usuario.');
    }
  };

  const handleEliminarDefinitivo = async () => {
    if (!confirm('¿Eliminar permanentemente este usuario?')) return;
    try {
      await api.delete(`/v1/users/${usuario.id}/eliminar-definitivamente/`, {
        headers: { 'X-Active-Company': empresaId },
      });
      queryClient.invalidateQueries(['usuarios']);
    } catch (error) {
      alert('Error al eliminar definitivamente.');
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
            <p className={`font-semibold ${usuario.role?.name === 'Admin' ? 'text-blue-500' : ''}`}>
              {usuario.username}
            </p>
            <p className="text-sm">{usuario.email}</p>
            <p className="text-sm italic">
              {usuario.first_name} {usuario.last_name}
            </p>

          {!usuario.is_active && !usuario.is_deleted && (
            <p className="text-sm text-yellow-500 font-semibold">Usuario inactivo</p>
          )}

          {usuario.is_deleted && (
            <p className="text-sm text-red-500 font-semibold">Usuario eliminado</p>
          )}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() =>
                navigate(`/home/usuarios/${usuario.id}`, {
                  state: { empresaId },
                })
              }
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              Ver detalles
            </button>

            {!usuario.is_deleted && (
              <>
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
              </>
            )}

            {usuario.is_deleted && (
              <>
                <button
                  onClick={handleRestaurar}
                  className="px-3 py-1 bg-green-700 text-white rounded"
                >
                  Restaurar
                </button>
                <button
                  onClick={handleEliminarDefinitivo}
                  className="px-3 py-1 bg-red-800 text-white rounded"
                >
                  Eliminar permanentemente
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
