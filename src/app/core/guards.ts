import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Papel } from './models';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.logado() ? true : inject(Router).createUrlTree(['/login']);
};

export const papelGuard =
  (papel: Papel): CanActivateFn =>
  () => {
    const auth = inject(AuthService);
    return auth.usuario()?.papel === papel ? true : inject(Router).createUrlTree(auth.rotaInicial());
  };

/** Raiz "/": manda cada papel para a sua tela inicial. */
export const inicioGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  return inject(Router).createUrlTree(auth.rotaInicial());
};

/** 401 fora do login = sessão expirada: volta ao login (ADR 0006). */
export const sessaoInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  return next(req).pipe(
    catchError((e: unknown) => {
      const ehAuth = req.url.includes('/auth/') || req.url.includes('/usuarios/me');
      if (e instanceof HttpErrorResponse && e.status === 401 && !ehAuth) auth.sessaoExpirada();
      return throwError(() => e);
    }),
  );
};
