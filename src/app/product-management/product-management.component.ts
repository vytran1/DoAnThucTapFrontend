import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [],
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.css',
})
export class ProductManagementComponent {
  constructor(private router: Router) {}

  redirectToCreateForm() {
    this.router.navigateByUrl('/inventory/create-product');
  }
}
