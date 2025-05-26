// src/pages/HomePage.jsx
export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-3xl font-bold mb-4">Panel de Administración</h1>
        <p className="text-gray-700 mb-4">
          Bienvenido al panel global. Aquí podrás gestionar tus empresas,
          usuarios y más.
        </p>

        <div className="border-t pt-4 text-gray-500">
          🚧 Esta sección está en construcción. Pronto verás tus empresas aquí.
        </div>
      </div>
    </div>
  );
}
