import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import localeEsAR from '@angular/common/locales/es-AR';
import { LOCALE_ID, isDevMode } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import 'zone.js';
import { provideServiceWorker } from '@angular/service-worker';

registerLocaleData(localeEs, 'es-ES');
registerLocaleData(localeEsAR, 'es-AR');

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    { provide: LOCALE_ID, useValue: 'es-ES' }, // Para fechas y pipes
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }, provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }), // Para datepicker en español
  ],
}).catch((err) => console.error(err));
