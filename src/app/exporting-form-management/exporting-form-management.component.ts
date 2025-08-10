import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exporting-form-management',
  standalone: true,
  imports: [],
  templateUrl: './exporting-form-management.component.html',
  styleUrl: './exporting-form-management.component.css',
})
export class ExportingFormManagementComponent {
  constructor(private router: Router) {}

  redirectoExportingFormCreatePage() {
    this.router.navigateByUrl('/inventory/create-exporting-form');
  }
}
