import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, inject } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
    provideRouter,
    withEnabledBlockingInitialNavigation,
    withInMemoryScrolling,
} from '@angular/router';
import Aura from '@primeng/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import { AuthInterceptor } from './app/pages/interceptors/auth-interceptor.service';
import { MessageService } from 'primeng/api';
import { provideAppInitializer } from '@angular/core';
import { ApplicationSettingService } from './app/pages/service/application.setting.service';

export function loadSettings() {
    const appSettingService = inject(ApplicationSettingService);
    return appSettingService.loadConfig();
  }

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(
            appRoutes,
            withInMemoryScrolling({
                anchorScrolling: 'enabled',
                scrollPositionRestoration: 'enabled',
            }),
            withEnabledBlockingInitialNavigation(),
        ),
        provideHttpClient(withFetch()),
        provideAnimationsAsync(),
        providePrimeNG({
            theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } },
        }),
        provideHttpClient(withInterceptors([AuthInterceptor])),
        MessageService,
        ApplicationSettingService,
        provideAppInitializer(loadSettings),
    ],
};
