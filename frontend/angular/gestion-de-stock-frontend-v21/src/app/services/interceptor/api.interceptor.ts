import { inject } from '@angular/core';
import {
  HttpClient,
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpResponse
} from '@angular/common/http';
import { Observable, tap, switchMap, catchError, throwError, finalize } from 'rxjs';

import { AuthenticationResponse } from '../../../gs-api/src/models/authentication-response';
import { LoaderService } from '../../composants/loader/service/loader.service';
import { NotificationService } from '../notification/notification.service';

/**
 * Intercepteur fonctionnel (best practice Angular >= 15, recommandation MCP Angular) :
 * remplace l'ancien HttpInterceptorService (classe + HTTP_INTERCEPTORS DI).
 *
 * Rôles :
 * - injecte le header Authorization: Bearer <accessToken> depuis le localStorage ;
 * - sur 401, renouvelle automatiquement la session via le refresh token puis rejoue
 *   la requête (un seul refresh à la fois : les requêtes concurrentes attendent le sien) ;
 * - si le refresh échoue, purge la session locale (déconnexion effective) ;
 * - affiche/masque le loader global autour de chaque requête HTTP ;
 * - notifie l'utilisateur des erreurs backend via le service de toasts.
 */

/** État partagé du refresh : évite N refresh concurrents sur N 401 simultanés */
let refreshEnCours: Observable<string> | null = null;

function purgerSession(): void {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('connectedUser');
}

function lancerRefresh(http: HttpClient): Observable<string> {
  if (refreshEnCours) {
    return refreshEnCours;
  }

  let refreshToken: string | undefined;
  try {
    const stocke = localStorage.getItem('accessToken');
    refreshToken = stocke ? (JSON.parse(stocke) as AuthenticationResponse).refreshToken : undefined;
  } catch {
    refreshToken = undefined;
  }
  if (!refreshToken) {
    purgerSession();
    return throwError(() => new Error('no-refresh-token'));
  }

  refreshEnCours = http
    .post<AuthenticationResponse>('/api/v1/authentification/refresh', { refreshToken })
    .pipe(
      tap((reponse) => {
        localStorage.setItem('accessToken', JSON.stringify(reponse));
      }),
      switchMap((reponse) => {
        if (!reponse?.accessToken) {
          purgerSession();
          return throwError(() => new Error('refresh-failed'));
        }
        return new Observable<string>((abonne) => {
          abonne.next(reponse.accessToken as string);
          abonne.complete();
        });
      }),
      catchError((erreur) => {
        purgerSession();
        return throwError(() => erreur ?? new Error('refresh-failed'));
      }),
      finalize(() => {
        refreshEnCours = null;
      })
    );
  return refreshEnCours;
}

export const apiInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const loaderService = inject(LoaderService);
  const notificationService = inject(NotificationService);
  const http = inject(HttpClient);

  loaderService.show();

  const isAppelAuth = req.url.includes('/authentification/');
  const token = localStorage.getItem('accessToken');
  let authReq = req;
  if (token && !isAppelAuth) {
    const authenticationResponse: AuthenticationResponse = JSON.parse(token);
    if (authenticationResponse.accessToken) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${authenticationResponse.accessToken}` }
      });
    }
  }

  return traiter(authReq, next, http).pipe(
    tap({
      next: (event: HttpEvent<unknown>) => {
        if (event instanceof HttpResponse) {
          loaderService.hide();
        }
      },
      error: (err: { error?: { message?: string; httpCode?: number }; message?: string }) => {
        loaderService.hide();
        // Session expirée et refresh impossible : message dédié + retour au login
        if (err?.error?.httpCode === 401 || err?.message === 'refresh-failed') {
          notificationService.info('Session expirée, veuillez vous reconnecter');
          return;
        }
        const message = err?.error?.message || err?.message || 'Une erreur est survenue';
        notificationService.error(message);
      }
    }),
    finalize(() => loaderService.hide())
  );
};

/** Chaîne une requête avec retry unique après refresh sur 401 */
function traiter(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  http: HttpClient
): Observable<HttpEvent<unknown>> {
  return next(req).pipe(
    catchError((erreur: { status?: number }) => {
      const isAppelAuth = req.url.includes('/authentification/');
      if (erreur?.status !== 401 || isAppelAuth) {
        return throwError(() => erreur);
      }
      return lancerRefresh(http).pipe(
        switchMap((accessToken) => {
          const rejouee = req.clone({
            setHeaders: { Authorization: `Bearer ${accessToken}` }
          });
          return next(rejouee);
        })
      );
    })
  );
}
