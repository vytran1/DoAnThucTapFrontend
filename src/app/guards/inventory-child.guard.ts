import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const inventoryChildGuard: CanActivateChildFn = (childRoute, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const url = childRoute.routeConfig?.path;

  if (url === 'report/sales-revenue') {
    if (authService.isSuperAdmin() || authService.isDirector()) {
      return true;
    }
    router.navigateByUrl('/forbidden');
    return false;
  }

  return true;
};
