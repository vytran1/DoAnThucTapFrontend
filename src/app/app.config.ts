import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptor/auth.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNgxMask } from 'ngx-mask';
import { SettingService } from './services/setting.service';
import { firstValueFrom } from 'rxjs';

const appInitFactory = (settingService: SettingService) => {
  return () =>
    firstValueFrom(settingService.loadSettings()).then((res) => {
      const body = res.body;
      if (Array.isArray(body)) {
        settingService.mapToSettings(body);
      }
    });
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([authInterceptor])),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideNgxMask(),
    {
      provide: APP_INITIALIZER,
      useFactory: appInitFactory,
      deps: [SettingService],
      multi: true,
    },
  ],
};
