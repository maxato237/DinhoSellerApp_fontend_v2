import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Observable, map, catchError, of } from 'rxjs';
import { UserService } from '../service/user.service';

export const superadminGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.checkSuperAdminConfigured().pipe(
    map((response: any) => {
      if (response.isSuperAdminConfigured) {
        console.log(response.isSuperAdminConfigured);
        return true;
      } else {
        console.log(response.isSuperAdminConfigured);
        router.navigate(['/setup']);
        return false;
      }
    }),
    catchError((error) => {
      console.error('Erreur lors de la vérification du super admin :', error);
      router.navigate(['/setup']);
      return of(false);
    })
  );
};
