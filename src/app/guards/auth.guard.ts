import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const service = inject(AuthService);
  const router = inject(Router);

  if (service.isAuth()) {

    // Verificar si el usuario es un admin

    if (route.routeConfig?.path === 'admin-dashboard' && !service.hasAdminRole()) {
      router.navigate(['/forbidden']);
      return false;
    }

    // Verifica si el usuario es un organizador

    if (route.routeConfig?.path === 'organizador-dashboard' && !service.hasOrganizadorRole()) {
      router.navigate(['/forbidden']);
      return false;
    }

    if (isTokenExpired()) {
      service.logout();
      router.navigate(['/home']);
      return false;
    }

    
    // Aquí puedes permitir el acceso a todos los usuarios autenticados
    return true;
  }

  router.navigate(['/forbidden']);
  return false;
};

const isTokenExpired = () => {
  const service = inject(AuthService);
  const token = service.token;
  const payload = service.getPayload(token);
  const exp = payload.exp;
  const now = new Date().getTime() / 1000;
  return now > exp;
};
