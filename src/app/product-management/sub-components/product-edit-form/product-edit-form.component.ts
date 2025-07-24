import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductVariantDetailModel } from '../../../model/product/product-variant-detail.model';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-product-edit-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    NgxMaskDirective,
  ],
  templateUrl: './product-edit-form.component.html',
  styleUrl: './product-edit-form.component.css',
})
export class ProductEditFormComponent implements OnInit {
  form: any;

  @Input() name: string | undefined = '';
  @Input() price: number | undefined = 0;

  @Output() onSave = new EventEmitter<{ newName: string; newPrice: number }>();
  @Output() onCancel = new EventEmitter<void>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      newName: [this.name || '', [Validators.required]],
      newPrice: [this.price || '', [Validators.required, Validators.min(1)]],
    });
  }

  save() {
    if (this.form.valid) {
      this.onSave.emit({
        newName: this.form.get('newName')?.value,
        newPrice: Number(this.form.get('newPrice')?.value),
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

  closed() {
    this.onCancel.emit();
  }

  priceFormatAndPositiveValidator() {
    return (control: any) => {
      const value = control.value;
      const pattern = /^[0-9.]+$/;

      if (!value) return null;

      if (!pattern.test(value)) {
        return { invalidFormat: true };
      }

      const cleaned = parseInt(value.replace(/\./g, ''), 10);
      if (isNaN(cleaned) || cleaned <= 0) {
        return { notPositive: true };
      }

      return null;
    };
  }
}
