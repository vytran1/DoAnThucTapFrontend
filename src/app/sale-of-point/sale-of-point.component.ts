import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { SearchVariantTableComponent } from '../shared-component/search-variant-table/search-variant-table.component';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductVariantWithStock } from '../model/product/product-variant-with-stock.model';
import { product_images_path } from '../../environment/environement.config';
import { InvoiceService } from '../services/invoice.service';

@Component({
  selector: 'app-sale-of-point',
  standalone: true,
  imports: [
    SearchVariantTableComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './sale-of-point.component.html',
  styleUrl: './sale-of-point.component.css',
})
export class SaleOfPointComponent implements OnInit, OnDestroy {
  isOpenSearchingModal = false;
  orderForm!: FormGroup;
  displayedColumns = ['image', 'sku', 'name', 'quantity', 'price', 'delete'];
  prefixPath = product_images_path;
  dataSource = new MatTableDataSource<any>([]);
  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private invoiceService: InvoiceService
  ) {}
  ngOnInit(): void {
    this.orderForm = this.fb.group(
      {
        orderDetails: this.fb.array([]),
      },
      {
        validators: [this.atLeastOneItem()],
      }
    );
  }

  ngOnDestroy(): void {}

  get orderDetails(): FormArray {
    return this.orderForm.get('orderDetails') as FormArray;
  }

  addProductToOrder(product: ProductVariantWithStock): void {
    console.log('Call Method', product);
    console.log('Before add:', this.orderDetails.length);
    console.log('Product received:', product);

    // Check if product already exists
    const existingIndex = this.orderDetails.controls.findIndex(
      (control: any) => control.value.productId === product.id
    );

    if (existingIndex !== -1) {
      // Update quantity if product exists
      const existingControl = this.orderDetails.at(existingIndex);
      const currentQuantity = existingControl.get('quantity')?.value || 0;
      const maxQuantity = existingControl.get('maxQuantity')?.value || 0;

      if (currentQuantity < maxQuantity) {
        existingControl.get('quantity')?.setValue(currentQuantity + 1);
      }
    } else {
      // Add new product
      const itemGroup = this.fb.group({
        productId: [product.parentId],
        name: [product.name],
        sku: [product.sku],
        cost_price: [product.cost_price],
        maxQuantity: [product.current_quantity],
        image: [product.image],
        quantity: [
          1,
          [
            Validators.required,
            Validators.min(1),
            Validators.max(product.current_quantity),
          ],
        ],
      });

      this.orderDetails.push(itemGroup);
      console.log('After add:', this.orderDetails.length);
      console.log('FormArray value:', this.orderDetails.value);
    }

    // Force change detection
    //this.cdr.detectChanges();

    this.updateDataSource();
  }

  removeItem(index: number): void {
    this.orderDetails.removeAt(index);
    this.updateDataSource();
  }

  openSearchingModal() {
    this.isOpenSearchingModal = true;
  }

  closeSearchingModal() {
    this.isOpenSearchingModal = false;
  }

  get totalQuantity(): number {
    return this.orderDetails.controls.reduce(
      (sum, group: any) => sum + group.value.quantity,
      0
    );
  }

  private updateDataSource(): void {
    this.dataSource.data = this.orderDetails.controls;
  }

  get totalTax(): number {
    return this.totalQuantity * 1;
  }

  get totalPrice(): number {
    return this.orderDetails.controls.reduce((sum, group: any) => {
      return sum + group.value.quantity * group.value.cost_price;
    }, 0);
  }

  private atLeastOneItem() {
    return (formGroup: FormGroup) => {
      const orderDetails = formGroup.get('orderDetails') as FormArray;
      return orderDetails && orderDetails.length > 0 ? null : { noItems: true };
    };
  }

  submitInvoice(): void {
    if (this.orderForm.invalid) {
      console.log('ERROR');
      this.orderForm.markAllAsTouched(); // kích hoạt hiển thị lỗi nếu có
      return;
    }

    const invoice = {
      quantity: this.totalQuantity,
      tax: this.totalTax,
      total: this.totalPrice + this.totalTax,
      details: this.orderDetails.value.map((item: any) => ({
        sku: item.sku,
        name: item.name,
        unit_price: item.cost_price,
        quantity: item.quantity,
      })),
    };

    console.log('Request body to send:', invoice);

    this.invoiceService.save(invoice).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
