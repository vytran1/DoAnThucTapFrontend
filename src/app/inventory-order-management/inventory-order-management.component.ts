import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventory-order-management',
  standalone: true,
  imports: [],
  templateUrl: './inventory-order-management.component.html',
  styleUrl: './inventory-order-management.component.css',
})
export class InventoryOrderManagementComponent {
  constructor(private router: Router) {}

  redirectToCreateForm() {
    this.router.navigateByUrl('/inventory/create-order');
  }
}
