import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core';
import { provideRouter, withInMemoryScrolling, withComponentInputBinding } from '@angular/router';
import {
  provideHttpClient,
  withInterceptors,
  withFetch
} from '@angular/common/http';

import { routes } from './app.routes';
import { apiInterceptor } from './services/interceptor/api.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Angular 21 : détection de changements sans Zone.js (best practice MCP Angular)
    provideZonelessChangeDetection(),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
      // Les paramètres de route (:id) deviennent des input() signal dans les composants
      withComponentInputBinding()
    ),
    // Intercepteur fonctionnel (best practice Angular >= 15) + backend API Fetch
    provideHttpClient(withInterceptors([apiInterceptor]), withFetch())
  ]
};
