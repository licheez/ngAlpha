import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import {HttpEvent, HttpHandlerFn, HttpRequest, provideHttpClient, withInterceptors} from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {Observable} from 'rxjs';
import {AlphaOasInterceptor} from '@pvway/alpha-oas';

const alphaInterceptorFn:(req: HttpRequest<any>, fn: HttpHandlerFn) =>
  Observable<HttpEvent<any>> =
  (req: HttpRequest<any>, fn: HttpHandlerFn) =>
    AlphaOasInterceptor.handlerFn(req, fn);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([alphaInterceptorFn]))
  ]
};
