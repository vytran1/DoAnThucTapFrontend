import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { SettingService } from './app/services/setting.service';
import { firstValueFrom } from 'rxjs';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
