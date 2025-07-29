import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { StartPageComponent } from './start-page/start-page.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { InventoryManagementComponent } from './inventory-management/inventory-management.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { CreateProductFormComponent } from './product-management/sub-components/create-product-form/create-product-form.component';
import { ProductInformationComponent } from './product-management/sub-components/product-information/product-information.component';
import { inventoryRoutes } from './vytran.routes';
import { ErrorPageWrapperComponent } from './shared-component/error-page-wrapper/error-page-wrapper.component';
import { ForbiddenPageComponent } from './shared-component/forbidden-page/forbidden-page.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  ...inventoryRoutes,
  { path: 'error', component: ErrorPageWrapperComponent },
  { path: 'forbidden', component: ForbiddenPageComponent },
  { path: '**', redirectTo: '/login', pathMatch: 'full' },
];
