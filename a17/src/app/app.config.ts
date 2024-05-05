import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes} from '@angular/router';

import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {AlphaOasInterceptor} from "../../projects/alpha-oas/src/lib/alpha-oas-interceptor";
import {AppSitemap} from "./app.sitemap";
import {WelcomePageComponent} from "./pages/welcome-page/welcome-page.component";
import {provideAnimations} from "@angular/platform-browser/animations";

const routes: Routes = [
  // MAIN
  { path: AppSitemap.welcome.route , component: WelcomePageComponent},
  // LAZY MODULES
  // PS
  { path: AppSitemap.psOutlet.route,
    loadChildren: () => import('./modules/ps/ps.module')
      .then(m => m.PsModule)
  },
  { path: '**', redirectTo: AppSitemap.welcome.route }
];

export const appConfig: ApplicationConfig = {

  providers: [
    provideRouter(routes),
    provideAnimations(),
    { provide: HTTP_INTERCEPTORS, useClass: AlphaOasInterceptor, multi: true }
  ]
};
