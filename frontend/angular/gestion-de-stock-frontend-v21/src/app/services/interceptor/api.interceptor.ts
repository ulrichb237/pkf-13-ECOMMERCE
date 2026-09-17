import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { AuthenticationResponse } from '../../../gs-api/src/models/authentication-response';
import { LoaderService } from '../../composants/loader/service/loader.service';
import { NotificationService } from '../notification/notification.service';

/**
 * Intercepteur fonctionnel (best practice Angular >= 15, recommandation MCP Angular) :
 * remplace l'ancien HttpInterceptorService (classe + HTTP_INTERCEPTORS DI).
 *
 * Rôles :
 * - injecte le header Authorization: Bearer <token> depuis le localStorage ;
 * - affiche/masque le loader global autour de chaque requête HTTP ;
 * - notifie l'utilisateur des erreurs backend via le service de toasts.
 */
export const apiInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const loaderService = inject(LoaderService);
  const notificationService = inject(NotificationService);
  loaderService.show();

  const token = localStorage.getItem('accessToken');
  let authReq = req;
  if (token) {
    const authenticationResponse: AuthenticationResponse = JSON.parse(token);
    if (authenticationResponse.accessToken) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${authenticationResponse.accessToken}` }
      });
    }
  }

  return next(authReq).pipe(
    tap({
      next: (event: HttpEvent<unknown>) => {
        if (event instanceof HttpResponse) {
          loaderService.hide();
        }
      },
      error: (err: { error?: { message?: string }; message?: string }) => {
        loaderService.hide();
        const message = err?.error?.message || err?.message || 'Une erreur est survenue';
        notificationService.error(message);
      }
    })
  );
};
