import { Routes } from '@angular/router';
import { StartPageComponent } from './start-page/start-page.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { InventoryManagementComponent } from './inventory-management/inventory-management.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { CreateProductFormComponent } from './product-management/sub-components/create-product-form/create-product-form.component';
import { ProductInformationComponent } from './product-management/sub-components/product-information/product-information.component';
import { StockingSearchComponent } from './stocking-search/stocking-search.component';
import { InventoryOrderManagementComponent } from './inventory-order-management/inventory-order-management.component';
import { ImportingFormManagementComponent } from './importing-form-management/importing-form-management.component';
import { ExportingFormManagementComponent } from './exporting-form-management/exporting-form-management.component';
import { OrderCreateFormComponent } from './inventory-order-management/sub-components/order-create-form/order-create-form.component';
import { OrderDetailsPageComponent } from './inventory-order-management/sub-components/order-details-page/order-details-page.component';
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
      {
        path: 'stocking-search',
        component: StockingSearchComponent,
      },
      {
        path: 'order-management',
        component: InventoryOrderManagementComponent,
      },
      {
        path: 'importing-form-management',
        component: ImportingFormManagementComponent,
      },
      {
        path: 'exporting-form-management',
        component: ExportingFormManagementComponent,
      },
      {
        path: 'create-order',
        component: OrderCreateFormComponent,
      },
      {
        path: 'inventory-order/:orderId',
        component: OrderDetailsPageComponent,
      },
    ],
  },
];
