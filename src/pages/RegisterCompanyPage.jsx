import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCrearEmpresa } from "@/hooks/empresas/useCrearEmpresa";
import LoadingOverlay from "@/components/LoadingOverlay";

export default function RegisterCompanyPage() {
  const [name, setName] = useState("");
  const [nit, setNit] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // 👈
  const navigate = useNavigate();
  const crearEmpresa = useCrearEmpresa();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true); // 👈 Mostrar loading de inmediato

    crearEmpresa.mutate(
      { name, nit },
      {
        onSuccess: () => {
          setTimeout(() => {
            navigate("/home/empresas");
          }, 300);
        },
        onError: () => {
          alert("Error al crear empresa. Verifica los datos.");
          setIsSubmitting(false); // 👈 Volver a habilitar el botón
        },
      }
    );
  };

  const isLoading = crearEmpresa.isLoading || isSubmitting;

  return (
    <div className="relative max-w-xl mx-auto space-y-6">
      {isLoading && <LoadingOverlay text="Registrando empresa..." />}

      <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">
        Registrar Nueva Empresa
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white dark:bg-gray-800 p-6 rounded-xl shadow"
      >
        <div>
          <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
            Nombre de la Empresa
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Mi empresa S.A.S"
            className="w-full px-4 py-2 border rounded-md dark:bg-gray-900 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
            NIT
          </label>
          <input
            type="text"
            value={nit}
            onChange={(e) => setNit(e.target.value)}
            placeholder="123456789-0"
            className="w-full px-4 py-2 border rounded-md dark:bg-gray-900 dark:text-white"
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md disabled:opacity-50"
          >
            {isLoading ? "Registrando..." : "Registrar"}
          </button>
        </div>
      </form>
    </div>
  );
}
