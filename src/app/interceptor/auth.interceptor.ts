import {
  HttpEvent,
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environment/environement.config';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const hostUrl = environment.apiUrl;
  const authService = inject(AuthService);
  const jwtHelper = new JwtHelperService();
  const router = inject(Router);
  if (
    req.url.includes(`${hostUrl}/api/auth/token`) ||
    req.url.includes(`${hostUrl}/api/forgot_password`) ||
    req.url.includes(`${hostUrl}/api/reset_password`) ||
    req.url.includes(`${hostUrl}/api/setting`)
  ) {
    return next(req);
  }

  const jwtToken = authService.getToken();
  //console.log('JWT Token:', jwtToken); // Debugging log
  if (jwtToken) {
    if (jwtHelper.isTokenExpired(jwtToken)) {
      authService.logout();
      router.navigate(['/login']);
      return throwError(() => new Error('Token expired'));
    }

    const requestClone = req.clone({
      setHeaders: { Authorization: `Bearer ${jwtToken}` },
    });
    //console.log('Request with token:', requestClone);
    return next(requestClone).pipe(
      catchError((error) => {
        if (error.status === 401) {
          authService.logout();
          router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  } else {
    return next(req);
  }
};
