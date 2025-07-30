import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InventoryService } from '../services/inventory.service';
import { ProvinceService } from '../services/province.service'; 
import { DistrictService } from '../services/district.service';

import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-inventory-edit',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule, 
    MatButtonModule, 
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule 
  ],
  templateUrl: './inventory-edit.component.html',
  styleUrls: ['./inventory-edit.component.css']
})
export class InventoryEditComponent implements OnInit {

  inventoryForm: FormGroup;
  provinces: any[] = [];
  districts: any[] = [];
  inventoryId: number | null = null;
  isLoading: boolean = true;
  originalInventory: any = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    @Inject(InventoryService) private inventoryService: InventoryService,
    private provinceService: ProvinceService,
    private districtService: DistrictService
  ) {
    this.inventoryForm = this.fb.group({
      inventoryName: ['', Validators.required],
      inventoryCode: ['', Validators.required],
      address: ['', Validators.required],
      provinceID: [null, Validators.required],
      districtID: [{ value: null, disabled: true }, Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.inventoryId = +params['id'];
      if (this.inventoryId) {
        this.loadProvinces();
        this.loadInventoryData();
      } else {
        this.snackBar.open('Invalid inventory ID!', 'Close', { duration: 3000 });
        this.router.navigate(['/inventory/inventory-management']);
      }
    });

    this.inventoryForm.get('provinceID')?.valueChanges.subscribe(provinceId => {
      const districtControl = this.inventoryForm.get('districtID');
      if (!this.isLoading) {
        districtControl?.reset();
        this.districts = [];
      }
      if (provinceId) {
        districtControl?.enable();
        this.loadDistricts(provinceId);
      } else {
        districtControl?.disable();
      }
    });
  }
  
  hasServerErrors(): boolean {
    return Object.keys(this.inventoryForm.controls).some(key => {
      const control = this.inventoryForm.get(key);
      return control && control.errors && control.errors['serverError'];
    });
  }

  loadProvinces(): void {
    this.provinceService.getProvinces().subscribe({
      next: (data) => this.provinces = data,
      error: (err) => {
        console.error('Failed to load provinces', err);
        this.snackBar.open('Error loading provinces!', 'Close', { duration: 3000 });
      }
    });
  }

  loadDistricts(provinceId: number): void {
    this.districtService.getDistrictsByProvince(provinceId).subscribe({
      next: (data) => {
        this.districts = data;
        if (this.isLoading && this.originalInventory) {
          this.inventoryForm.patchValue({ districtID: this.originalInventory.districtID });
          this.inventoryForm.get('districtID')?.enable();
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Failed to load districts', err);
        this.snackBar.open('Error loading districts!', 'Close', { duration: 3000 });
      }
    });
  }

  loadInventoryData(): void {
    if (!this.inventoryId) return;
    
    this.inventoryService.getInventoryById(this.inventoryId).subscribe({
      next: (inventory) => {
        this.originalInventory = inventory;
        this.inventoryForm.patchValue({
          inventoryName: inventory.inventoryName,
          inventoryCode: inventory.inventoryCode,
          address: inventory.address,
          provinceID: inventory.provinceID
        });
        if (inventory.provinceID) {
          this.loadDistricts(inventory.provinceID);
        } else {
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Failed to load inventory', err);
        this.snackBar.open('Error loading inventory data!', 'Close', { duration: 3000 });
        this.router.navigate(['/inventory/inventory-management']);
      }
    });
  }

  onSave(): void {
    if (this.inventoryForm.invalid) {
      this.inventoryForm.markAllAsTouched(); 
      return; 
    }
    
    if (!this.inventoryId) {
      this.snackBar.open('Invalid inventory ID!', 'Close', { duration: 3000 });
      return;
    }
    
    this.clearServerErrors();

    const rawValue = this.inventoryForm.getRawValue();
    const payload = {
      ...rawValue,
      inventoryName: rawValue.inventoryName.trim(),
      inventoryCode: rawValue.inventoryCode.trim(),
      address: rawValue.address.trim()
    };
    
    this.inventoryService.updateInventory(this.inventoryId, payload).subscribe({
      next: () => {
        this.snackBar.open('Inventory updated successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/inventory/inventory-management']);
      },
      error: (err: any) => {
        console.error('Failed to update inventory', err);
        
        if (err.status === 400 && err.error && err.error.error && Array.isArray(err.error.error)) {
          this.handleValidationErrors(err.error.error);
        }
        else if (err.status === 500 || 
                 (err.error && err.error.message && 
                  (err.error.message.includes('Duplicate entry') || 
                   err.error.message.toLowerCase().includes('inventory code') && 
                   err.error.message.toLowerCase().includes('already exists')))) {
          this.setFieldError('inventoryCode', 'This inventory code already exists. Please choose a different code.');
          this.inventoryForm.markAllAsTouched();
        }
        else if (err.error && err.error.message && 
                 (err.error.message.toLowerCase().includes('duplicate') || 
                  err.error.message.toLowerCase().includes('already exists'))) {
          this.setFieldError('inventoryCode', err.error.message);
          this.inventoryForm.markAllAsTouched();
        }
        else {
          this.snackBar.open('ERROR: Could not update inventory!', 'Close', { duration: 3000 });
        }
      }
    });
  }

  private handleValidationErrors(errors: string[]): void {
    errors.forEach(errorMessage => {
      if (errorMessage.toLowerCase().includes('inventory name')) {
        this.setFieldError('inventoryName', errorMessage);
      }
      else if (errorMessage.toLowerCase().includes('inventory code')) {
        if (errorMessage.toLowerCase().includes('duplicate') || 
            errorMessage.toLowerCase().includes('already exists') ||
            errorMessage.toLowerCase().includes('unique')) {
          this.setFieldError('inventoryCode', 'This inventory code already exists. Please choose a different code.');
        } else {
          this.setFieldError('inventoryCode', errorMessage);
        }
      }
      else if (errorMessage.toLowerCase().includes('address')) {
        this.setFieldError('address', errorMessage);
      }
      else if (errorMessage.toLowerCase().includes('province')) {
        this.setFieldError('provinceID', errorMessage);
      }
      else if (errorMessage.toLowerCase().includes('district')) {
        this.setFieldError('districtID', errorMessage);
      }
      else if (errorMessage.toLowerCase().includes('duplicate') || 
               errorMessage.toLowerCase().includes('already exists')) {
        this.setFieldError('inventoryCode', errorMessage);
      }
    });
    this.inventoryForm.markAllAsTouched();
  }

  private setFieldError(fieldName: string, errorMessage: string): void {
    const control = this.inventoryForm.get(fieldName);
    if (control) {
      control.setErrors({ ...control.errors, serverError: errorMessage });
    }
  }

  private clearServerErrors(): void {
    Object.keys(this.inventoryForm.controls).forEach(key => {
      const control = this.inventoryForm.get(key);
      if (control && control.errors && control.errors['serverError']) {
        delete control.errors['serverError'];
        if (Object.keys(control.errors).length === 0) {
          control.setErrors(null);
        }
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/inventory/inventory-management']);
  }

  trimWhitespace(controlName: string): void {
    const control = this.inventoryForm.get(controlName);
    if (control && control.value && typeof control.value === 'string') {
      control.setValue(control.value.trim(), { emitEvent: false });
    }
  }
}