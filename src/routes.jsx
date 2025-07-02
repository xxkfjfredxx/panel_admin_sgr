// src/routes.jsx
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
  Navigate,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";

import DashboardLayout       from "@/layouts/Dashboard";
import LoginPage             from "@/pages/LoginPage";
import HomePage              from "@/pages/HomePage";
import CompanyListPage       from "@/pages/CompanyListPage";
import RegisterUserPage      from "@/pages/usuarios/RegisterUserPage";
import RegisterCompanyPage   from "@/pages/RegisterCompanyPage";
import CompanyDetailPage     from "@/pages/CompanyDetailPage";
import EmpresaUsuariosPage   from "@/pages/usuarios/EmpresaUsuariosPage";
import UserDetailPage        from "@/pages/usuarios/UserDetailPage";
import CompanyRolesPage      from "@/pages/companies/CompanyRolesPage";
import ErrorFallback         from "@/components/ErrorFallback";

/* -----------------------------------------------------------
 * 1.  Guard: si llega ?expired=1, redirige a /login y limpia qs
 * ---------------------------------------------------------- */
function SessionGuard() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("expired") === "1" && !location.pathname.startsWith("/login")) {
      params.delete("expired");
      navigate("/login?session=expired", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);   // se dispara en cada navegación

  return <Outlet />;
}

/* -----------------------------------------------------------
 * 2.  Definición de rutas
 * ---------------------------------------------------------- */
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<SessionGuard />}>
      {/* Login (fuera del dashboard) */}
      <Route path="/login" element={<LoginPage />} />

      {/* Redirección raíz */}
      <Route path="/" element={<Navigate to="/home" replace />} />

      {/* Rutas con layout */}
      <Route path="/home" element={<DashboardLayout />}>
        <Route index element={<HomePage />} />

        {/* Empresas */}
        <Route path="empresas" element={<CompanyListPage />} />
        <Route path="empresas/crear" element={<RegisterCompanyPage />} />
        <Route
          path="empresas/:id"
          element={<CompanyDetailPage />}
          errorElement={<ErrorFallback />}
        />
        <Route path="empresas/:id/roles" element={<CompanyRolesPage />} />
        <Route path="empresas/:id/usuarios" element={<EmpresaUsuariosPage />} />
        <Route path="empresas/:id/usuarios/crear" element={<RegisterUserPage />} />

        {/* Usuarios */}
        <Route path="usuarios/:id" element={<UserDetailPage />} />
      </Route>
    </Route>
  )
);

/* -----------------------------------------------------------
 * 3.  Exporta el proveedor de rutas
 * ---------------------------------------------------------- */
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
