import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient  } from '@angular/common/http';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideCharts } from 'ng2-charts';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


export const appConfig: ApplicationConfig = {
  providers: [
    //provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes),
    provideHttpClient(), 
    provideAnimations(), 
    provideAnimationsAsync(),
    provideCharts()
  ]
};