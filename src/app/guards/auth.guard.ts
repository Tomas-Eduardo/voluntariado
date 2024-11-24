import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const service = inject(AuthService);
  const router = inject(Router);

  if (service.isAuth()) {
    // Verificar si el usuario es un admin y está intentando acceder a una ruta restringida
    if (route.routeConfig?.path === 'admin-dashboard' && !service.hasAdminRole()) {
      router.navigate(['/forbidden']);
      return false;
    }

    // Verificar si el usuario es un organizador y está intentando acceder a una ruta restringida
    if (route.routeConfig?.path === 'organizador-dashboard' && !service.hasOrganizadorRole()) {
      router.navigate(['/forbidden']);
      return false;
    }

    // Verificar si el usuario es admin u organizador y está intentando acceder a user-dashboard
    if (route.routeConfig?.path === 'user-dashboard' && 
        (service.hasAdminRole() || service.hasOrganizadorRole())) {
      router.navigate(['/forbidden']);
      return false;
    }

    // Verificar si el token está expirado
    if (isTokenExpired()) {
      service.logout();
      router.navigate(['/home']);
      return false;
    }

    // Permitir acceso a los usuarios autenticados
    return true;
  }

  // Si no está autenticado, redirigir a la página de acceso denegado
  router.navigate(['/forbidden']);
  return false;
};

// Función para verificar si el token ha expirado
const isTokenExpired = () => {
  const service = inject(AuthService);
  const token = service.token;
  const payload = service.getPayload(token);
  const exp = payload.exp;
  const now = new Date().getTime() / 1000;
  return now > exp;
};
