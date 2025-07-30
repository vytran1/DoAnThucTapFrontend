import { Routes } from '@angular/router';
import { StartPageComponent } from './start-page/start-page.component';
import { InventoryManagementComponent } from './inventory-management/inventory-management.component';
import { InventoryCreateComponent } from './inventory-management/inventory-create.component';
import { InventoryEditComponent } from './inventory-management/inventory-edit.component'; // Đảm bảo bạn đã import component này

export const tuanngRoutes: Routes = [
  {
    path: 'tuanng',
    component: StartPageComponent,
    children: [
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
          component: InventoryEditComponent
        },
    ]
  }
];