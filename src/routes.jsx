// src/routes.jsx
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
  Navigate,
} from 'react-router-dom';

import DashboardLayout       from '@/layouts/Dashboard';
import LoginPage             from '@/pages/LoginPage';
import HomePage              from '@/pages/HomePage';
import CompanyListPage       from '@/pages/CompanyListPage';
import RegisterUserPage      from '@/pages/usuarios/RegisterUserPage';
import RegisterCompanyPage   from '@/pages/RegisterCompanyPage';
import CompanyDetailPage     from '@/pages/CompanyDetailPage';
import EmpresaUsuariosPage   from '@/pages/usuarios/EmpresaUsuariosPage'; // ✅ agregado
import ErrorFallback         from '@/components/ErrorFallback';
import UserDetailPage        from '@/pages/usuarios/UserDetailPage';
import CompanyRolesPage      from "@/pages/companies/CompanyRolesPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to="/home" replace />} />

      <Route path="/home" element={<DashboardLayout />}>
        <Route index element={<HomePage />} />
        <Route path="empresas" element={<CompanyListPage />} />
        <Route path="empresas/crear" element={<RegisterCompanyPage />} />
        <Route path="empresas/:id" element={<CompanyDetailPage />} errorElement={<ErrorFallback />} />
        <Route path="empresas/:id/roles" element={<CompanyRolesPage />} />
        {/* ✅ Ruta faltante agregada */}
        <Route path="empresas/:id/usuarios" element={<EmpresaUsuariosPage />} />
        <Route path="empresas/:id/usuarios/crear" element={<RegisterUserPage />} />

        {/* ✅ Ruta para ver detalle individual */}
        <Route path="usuarios/:id" element={<UserDetailPage />} />
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
