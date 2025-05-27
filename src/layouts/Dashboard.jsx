// src/layouts/Dashboard.jsx
import { Link, Outlet, useLocation } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', path: '/home' },
  { name: 'Empresas', path: '/home/empresas' },
  { name: 'Usuarios', path: '/home/usuarios' },
];

export default function DashboardLayout() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg p-4 space-y-4">
        <h2 className="text-2xl font-bold mb-6">SGR Panel</h2>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-3 py-2 rounded-md transition-all duration-200 ${
                pathname === item.path
                  ? 'bg-indigo-600 text-white'
                  : 'hover:bg-indigo-100 dark:hover:bg-indigo-700'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
