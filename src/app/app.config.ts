import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // <- Añadir esto
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { authInterceptor } from './interceptors/auth.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    //provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes),
    provideHttpClient(), // <- Configurar HttpClient
    provideAnimations(), provideAnimationsAsync()
  ]
};