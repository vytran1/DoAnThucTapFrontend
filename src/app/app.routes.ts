import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { StartPageComponent } from './start-page/start-page.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { InventoryManagementComponent } from './inventory-management/inventory-management.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'inventory',
    component: StartPageComponent,
    children: [
      {
        path: 'personal-info',
        component: PersonalInfoComponent,
      },
      {
        path: 'inventory-management',
        component: InventoryManagementComponent,
      },
    ],
  },
];
