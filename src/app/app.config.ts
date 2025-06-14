import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { authInterceptor } from './interceptors/auth.interceptor';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(
            routes,
            withViewTransitions(),
            withComponentInputBinding(),
            withInMemoryScrolling({ scrollPositionRestoration: 'enabled' })

        ),
        provideHttpClient(
            withInterceptors([authInterceptor])
        ),
    ]
};
