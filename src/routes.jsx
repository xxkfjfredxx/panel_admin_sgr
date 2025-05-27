// src/routes.jsx
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
  Navigate,
} from 'react-router-dom';

import DashboardLayout      from '@/layouts/Dashboard';
import LoginPage            from '@/pages/LoginPage';
import HomePage             from '@/pages/HomePage';
import CompanyListPage      from '@/pages/CompanyListPage';
import UserListPage         from '@/pages/UserListPage';
import RegisterUserPage     from '@/pages/RegisterUserPage';
import RegisterCompanyPage  from '@/pages/RegisterCompanyPage';
import CompanyDetailPage    from '@/pages/CompanyDetailPage';
import ErrorFallback        from '@/components/ErrorFallback';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/home" replace />} />

      <Route path="/home" element={<DashboardLayout />}>
        <Route index                    element={<HomePage />} />
        <Route path="empresas"          element={<CompanyListPage />} />
        <Route path="empresas/crear"    element={<RegisterCompanyPage />} />
        <Route path="usuarios"          element={<UserListPage />} />
        <Route path="usuarios/crear"    element={<RegisterUserPage />} />
        <Route
          path="empresas/:id"
          element={<CompanyDetailPage />}
          errorElement={<ErrorFallback />}   /* ← manejar 404/errores de la vista    */
        />
      </Route>
    </>
  )
);

export default function AppRoutes() {
  return (
    <RouterProvider
      router={router}
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    />
  );
}
