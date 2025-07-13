import { Routes } from '@angular/router';
import { StartPageComponent } from './start-page/start-page.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { InventoryManagementComponent } from './inventory-management/inventory-management.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { CreateProductFormComponent } from './product-management/sub-components/create-product-form/create-product-form.component';
import { ProductInformationComponent } from './product-management/sub-components/product-information/product-information.component';
export const inventoryRoutes: Routes = [
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
      {
        path: 'product-management',
        component: ProductManagementComponent,
      },
      {
        path: 'create-product',
        component: CreateProductFormComponent,
      },
      {
        path: 'product-information/:productId',
        component: ProductInformationComponent,
      },
    ],
  },
];
