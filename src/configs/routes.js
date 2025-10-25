// src/configs/routes.js
export const API_ROUTES = {
  // Auth
  LOGIN: 'auth/login',
  LOGOUT: 'auth/logout',
  REFRESH: 'auth/refresh',

  // Core (usa lo que ya expone tu backend)
  EMPRESAS: 'v1/companies/',
  EMPRESAS_MY: 'v1/companies/my-companies/',

  USUARIOS: 'v1/users/',
  EMPLEADOS: 'v1/employees/',
  USER_ROLES: 'v1/user-roles/',
};
