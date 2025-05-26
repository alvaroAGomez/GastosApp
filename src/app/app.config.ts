// main.ts (o donde definas tu ApplicationConfig)
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  provideAnimations,
  BrowserAnimationsModule,
} from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { ToastrModule, provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor'; // funcional
import { spinnerInterceptor } from './core/interceptors/spinner.interceptor'; // funcional

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // Cliente HTTP con ambos interceptores funcionales
    provideHttpClient(withInterceptors([authInterceptor])),

    // Animaciones y Toastr
    provideAnimations(),
    provideAnimationsAsync(),
    provideToastr(),
    importProvidersFrom(
      BrowserAnimationsModule,
      ToastrModule.forRoot({
        positionClass: 'toast-top-right',
        preventDuplicates: true,
        closeButton: true,
        timeOut: 3000,
        newestOnTop: true,
        tapToDismiss: true,
        enableHtml: true,
      })
    ),
  ],
};
