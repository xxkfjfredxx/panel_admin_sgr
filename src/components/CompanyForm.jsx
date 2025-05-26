import { useState } from 'react';
import axios from 'axios';

export default function CompanyForm() {
  const [form, setForm] = useState({
    company_name: '',
    nit: '',
    admin_email: '',
    admin_password: '',
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://tu-api.com/api/register-company/', form);
      alert('Empresa registrada correctamente');
    } catch (err) {
      console.error(err);
      alert('Error al registrar empresa');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
      <input name="company_name" placeholder="Nombre empresa" onChange={handleChange} required />
      <input name="nit" placeholder="NIT" onChange={handleChange} required />
      <input type="email" name="admin_email" placeholder="Correo admin" onChange={handleChange} required />
      <input type="password" name="admin_password" placeholder="Contraseña" onChange={handleChange} required />
      <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">Registrar Empresa</button>
    </form>
  );
}
