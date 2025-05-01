import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { take, map } from 'rxjs/operators';

// Guard único configurable: protected=true (requiere login), protected=false (solo para no logueados)
export function accessGuard(protectedRoute: boolean): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.isAuthenticated.pipe(
      take(1),
      map((isAuth) => {
        if (protectedRoute) {
          if (isAuth) return true;
          router.navigate(['/login']);
          return false;
        } else {
          if (!isAuth) return true;
          router.navigate(['/']);
          return false;
        }
      })
    );
  };
}
