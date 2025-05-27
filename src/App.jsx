// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import LoginPage            from './pages/LoginPage';
import RegisterCompanyPage  from './pages/RegisterCompanyPage';
import HomePage             from './pages/HomePage';
import DashboardLayout      from './layouts/Dashboard';
import CompanyListPage      from './pages/CompanyListPage';
import CompanyDetailPage    from './pages/CompanyDetailPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login"   element={<LoginPage />} />
        <Route path="/register" element={<RegisterCompanyPage />} />

        <Route path="/home" element={<DashboardLayout />}>
          <Route index                     element={<HomePage />} />
          <Route path="empresas"           element={<CompanyListPage />} />
          <Route path="empresas/crear"     element={<RegisterCompanyPage />} />
          <Route path="empresas/:id"       element={<CompanyDetailPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
