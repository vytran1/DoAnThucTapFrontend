import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
import { MatIcon } from "@angular/material/icon"; 

@Component({
  selector: 'app-inventory-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatCardModule, MatIcon],
  templateUrl: './inventory-create.component.html',
  styleUrls: ['./inventory-create.component.css']
})
export class InventoryCreateComponent implements OnInit {
hasServerErrors(): boolean {
  return Object.keys(this.inventoryForm.controls).some(key => {
    const control = this.inventoryForm.get(key);
    return control && control.errors && control.errors['serverError'];
  });
}

  inventoryForm: FormGroup;
  provinces: any[] = [];
  districts: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    @Inject(InventoryService) private inventoryService: InventoryService,
    // THAY ĐỔI 2: Inject các service thật
    private provinceService: ProvinceService,
    private districtService: DistrictService
  ) {
    // ... Giữ nguyên constructor logic ...
    this.inventoryForm = this.fb.group({
      inventoryName: ['', Validators.required],
      inventoryCode: ['', Validators.required],
      address: ['', Validators.required],
      provinceID: [null, Validators.required],
      districtID: [{ value: null, disabled: true }, Validators.required]
    });
  }

  ngOnInit(): void {
    // THAY ĐỔI 3: Tải danh sách tỉnh/thành từ API
    this.loadProvinces();

    // Lắng nghe sự thay đổi của trường tỉnh/thành
    this.inventoryForm.get('provinceID')?.valueChanges.subscribe(provinceId => {
      const districtControl = this.inventoryForm.get('districtID');
      districtControl?.reset();
      this.districts = []; // Xóa danh sách quận huyện cũ

      if (provinceId) {
        districtControl?.enable();
        // THAY ĐỔI 4: Tải danh sách quận/huyện từ API
        this.loadDistricts(provinceId);
      } else {
        districtControl?.disable();
      }
    });
  }

  loadProvinces(): void {
    this.provinceService.getProvinces().subscribe(data => {
      this.provinces = data;
    });
  }

  loadDistricts(provinceId: number): void {
    this.districtService.getDistrictsByProvince(provinceId).subscribe(data => {
      this.districts = data;
    });
  }


onSave(): void {
  if (this.inventoryForm.invalid) {
    this.inventoryForm.markAllAsTouched(); 
    return; 
  }
  
  // Xóa các lỗi server trước khi gửi request mới
  this.clearServerErrors();
  
  const rawValue = this.inventoryForm.getRawValue();
  const payload = {
    ...rawValue,
    inventoryName: rawValue.inventoryName.trim(),
    inventoryCode: rawValue.inventoryCode.trim(),
    address: rawValue.address.trim()
  };
  
  this.inventoryService.createInventory(payload).subscribe({
    next: () => {
      this.snackBar.open('Inventory created successfully!', 'Close', { duration: 3000 });
      this.router.navigate(['/inventory/inventory-management']);
    },
    error: (err: any) => {
      console.error('Failed to create inventory', err);
      
      // Xử lý lỗi validation từ server (status 400)
      if (err.status === 400 && err.error && err.error.error && Array.isArray(err.error.error)) {
        this.handleValidationErrors(err.error.error);
      }
      // Xử lý lỗi trùng Inventory Code (status 409 hoặc message chứa duplicate)
      else if (err.status === 500 || 
               (err.error && err.error.message && 
                (err.error.message.includes('Duplicate entry') || 
                 err.error.message.toLowerCase().includes('inventory code') && 
                 err.error.message.toLowerCase().includes('already exists')))) {
        this.setFieldError('inventoryCode', 'This inventory code already exists. Please choose a different code.');
        this.inventoryForm.markAllAsTouched();
      }
      // Xử lý lỗi trùng với message chung (có thể server trả về message khác)
      else if (err.error && err.error.message && 
               (err.error.message.toLowerCase().includes('duplicate') || 
                err.error.message.toLowerCase().includes('already exists'))) {
        this.setFieldError('inventoryCode', err.error.message);
        this.inventoryForm.markAllAsTouched();
      }
      // Lỗi chung
      else {
        this.snackBar.open('ERROR: Could not create inventory!', 'Close', { duration: 3000 });
      }
    }
  });
}

// Hàm xử lý lỗi validation từ server
private handleValidationErrors(errors: string[]): void {
  errors.forEach(errorMessage => {
    // Xác định trường nào bị lỗi dựa trên nội dung error message
    if (errorMessage.toLowerCase().includes('inventory name')) {
      this.setFieldError('inventoryName', errorMessage);
    }
    else if (errorMessage.toLowerCase().includes('inventory code')) {
      // Kiểm tra xem có phải lỗi trùng code không
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
    // Xử lý lỗi trùng chung (nếu server không chỉ rõ trường nào)
    else if (errorMessage.toLowerCase().includes('duplicate') || 
             errorMessage.toLowerCase().includes('already exists')) {
      this.setFieldError('inventoryCode', errorMessage);
    }
  });
  
  // Đánh dấu form như đã được touch để hiển thị lỗi
  this.inventoryForm.markAllAsTouched();
}

// Hàm set lỗi cho một trường cụ thể
private setFieldError(fieldName: string, errorMessage: string): void {
  const control = this.inventoryForm.get(fieldName);
  if (control) {
    control.setErrors({ 
      ...control.errors, // Giữ lại các lỗi client-side validation
      serverError: errorMessage 
    });
  }
}

// Hàm xóa tất cả lỗi server trước khi gửi request mới
private clearServerErrors(): void {
  Object.keys(this.inventoryForm.controls).forEach(key => {
    const control = this.inventoryForm.get(key);
    if (control && control.errors && control.errors['serverError']) {
      delete control.errors['serverError'];
      
      // Nếu không còn lỗi nào khác, set errors = null
      if (Object.keys(control.errors).length === 0) {
        control.setErrors(null);
      }
    }
  });
}
  onCancel(): void {
    this.router.navigate(['/inventory/inventory-management']); // Điều hướng về trang danh sách
  }

   trimWhitespace(controlName: string): void {
    const control = this.inventoryForm.get(controlName);
    if (control && control.value && typeof control.value === 'string') {
      control.setValue(control.value.trim(), { emitEvent: false });
    }
  }
}