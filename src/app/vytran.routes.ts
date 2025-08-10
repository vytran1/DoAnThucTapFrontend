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
import { InventoryCreateComponent } from './inventory-management/inventory-create.component';
import { ExportingFormManagementComponent } from './exporting-form-management/exporting-form-management.component';
import { OrderCreateFormComponent } from './inventory-order-management/sub-components/order-create-form/order-create-form.component';
import { OrderDetailsPageComponent } from './inventory-order-management/sub-components/order-details-page/order-details-page.component';

import { ImportingFormDetailsPageComponent } from './importing-form-management/sub-components/importing-form-details-page/importing-form-details-page.component';
import { RestockSuggestionComponent } from './restock-suggestion/restock-suggestion.component';
import { SaleOfPointComponent } from './sale-of-point/sale-of-point.component';
import { SaleRevenueComponent } from './reports/sale-revenue/sale-revenue.component';
import { inventoryGuard } from './guards/inventory.guard';
import { inventoryChildGuard } from './guards/inventory-child.guard';

import { InventoryEditComponent } from './inventory-management/inventory-edit.component';
import { StockingRevenueComponent } from './reports/stocking-revenue/stocking-revenue.component';
import { CreateExportingFormComponent } from './exporting-form-management/sub-components/create-exporting-form/create-exporting-form.component';
import { ExportingFormDetailComponent } from './exporting-form-management/sub-components/exporting-form-detail/exporting-form-detail.component';

export const inventoryRoutes: Routes = [
  {
    path: 'inventory',
    component: StartPageComponent,
    canActivate: [inventoryGuard],
    canActivateChild: [inventoryChildGuard],
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
        path: 'create-new',
        component: InventoryCreateComponent,
      },
      {
        path: 'edit/:id',
        component: InventoryEditComponent,
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
      {
        path: 'importing-form/:formId',
        component: ImportingFormDetailsPageComponent,
      },
      {
        path: 'analysis/restock-suggestion',
        component: RestockSuggestionComponent,
      },
      {
        path: 'report/sales-revenue',
        component: SaleRevenueComponent,
      },
      {
        path: 'report/stock-revenue',
        component: StockingRevenueComponent,
      },
      {
        path: 'create-exporting-form',
        component: CreateExportingFormComponent,
      },
      {
        path: 'exporting-form/:formId',
        component: ExportingFormDetailComponent,
      },
    ],
  },
  {
    path: 'sale-of-point',
    component: SaleOfPointComponent,
  },
];
