import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ProductTableComponent } from '../../../shared-component/product-table/product-table.component';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductVariantForTransactionModel } from '../../../model/product/product-variant-for-transaction.model';
import { OrderDetailWithExpectedPrice } from '../../../model/inventory-order/order-detail-with-expected-price.model';
import { UploadFileComponent } from '../../../shared-component/upload-file/upload-file.component';
import { MessageModalComponent } from '../../../shared-component/message-modal/message-modal.component';
import * as XLSX from 'xlsx';
import { Subscription } from 'rxjs';
import { SupplierService } from '../../../services/supplier.service';
import { SupplierForDropdownList } from '../../../model/supplier-for-dropdown-list';
import { OrderAggregator } from '../../../model/inventory-order/order-aggregator.model';
import { InventoryOrderService } from '../../../services/inventory-order.service';
import { WarningModalComponent } from '../../../shared-component/warning-modal/warning-modal.component';

@Component({
  selector: 'app-order-create-form',
  standalone: true,
  imports: [
    ProductTableComponent,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    FormsModule,
    UploadFileComponent,
    MessageModalComponent,
    ReactiveFormsModule,
    WarningModalComponent,
  ],
  templateUrl: './order-create-form.component.html',
  styleUrl: './order-create-form.component.css',
})
export class OrderCreateFormComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  orderForm!: FormGroup;

  isOpenModalAddProduct = false;
  isOpenModalUploadFile = false;
  isOpenMessageModal = false;
  isProcessing = false;

  isOpenWarningModal = false;
  title = '';
  message = '';

  errorSku: string = '';

  selectedSupplierId: number = 0;

  suppliers: SupplierForDropdownList[] = [];

  //stockItems: OrderDetailWithExpectedPrice[] = [];

  displayedColumns = ['sku', 'name', 'quantity', 'expectedPrice', 'action'];

  dataSource = new MatTableDataSource<FormGroup>([]);

  refreshTable() {
    this.dataSource.data = this.stockItems.controls as FormGroup[];
  }

  constructor(
    private supplierService: SupplierService,
    private fb: FormBuilder,
    private orderService: InventoryOrderService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.supplierService.getAllSupplierForDropdownList().subscribe({
        next: (response) => {
          this.suppliers = response.body;
        },
      })
    );

    this.orderForm = this.fb.group({
      supplier: [null, Validators.required],
      stockItems: this.fb.array([]), // sẽ push từng sản phẩm vào đây
    });

    this.dataSource = new MatTableDataSource(
      this.stockItems.controls as FormGroup[]
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  get stockItems(): FormArray {
    return this.orderForm.get('stockItems') as FormArray;
  }

  addStockItem(item: OrderDetailWithExpectedPrice) {
    this.stockItems.push(
      this.fb.group({
        sku: [item.sku],
        name: [item.name],
        quantity: [item.quantity, [Validators.required, Validators.min(1)]],
        expected_price: [
          item.expected_price,
          [Validators.required, Validators.min(1)],
        ],
      })
    );
    // this.refreshTable();
  }

  // get dataSource() {
  //   return this.stockItems.controls;
  // }

  openModalAddProduct() {
    this.isOpenModalAddProduct = true;
  }

  closeModalAddProduct() {
    this.isOpenModalAddProduct = false;
  }

  removeItem(index: number) {
    this.stockItems.removeAt(index);
    this.refreshTable();
  }

  importFromExcel(file: File) {
    // Placeholder logic for importing Excel
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const buffer = e.target!.result as ArrayBuffer;
      const parsedData = this.parseExcelBuffer(buffer);

      if (!parsedData) {
        this.title = 'Invalid File';
        this.message =
          'File does not have valid format. Sheet "order_detail" is missing.';
        this.isOpenMessageModal = true;
        return;
      }

      this.stockItems.clear();
      parsedData.forEach((item) => {
        this.addStockItem(item);
      });
      this.refreshTable();
      this.isOpenModalUploadFile = false;
    };
    reader.readAsArrayBuffer(file);
  }

  createStockIn() {
    this.isOpenWarningModal = false;
    this.title = '';
    this.message = '';

    if (this.orderForm.invalid || this.stockItems.length === 0) {
      this.title = 'Invalid Form';
      this.message = 'Please select a supplier and add at least one product.';
      this.isOpenMessageModal = true;
      return;
    }

    const requestBody: OrderAggregator = {
      supplier: this.orderForm.get('supplier')?.value,
      order_details: this.stockItems.value, // ✅ get raw value of FormArray
    };

    console.log(requestBody);
    this.isProcessing = true;
    this.orderService.saveOrder(requestBody).subscribe({
      next: (response) => {
        this.title = 'Successfully';
        this.message = 'Created Order Successfully';
        this.isOpenMessageModal = true;
      },
      error: (err) => {
        console.log(err);
        this.title = 'Error';
        this.errorSku = err.error.sku;
        this.message = err.error.error;
        this.isOpenMessageModal = true;
        this.isProcessing = false;
      },
      complete: () => {
        this.isProcessing = false;
      },
    });
  }

  checkValidateOfOrder() {
    if (!this.selectedSupplierId || this.selectedSupplierId === 0) {
      this.title = 'Missing Supplier';
      this.message = 'Please select a supplier before proceeding.';
      this.isOpenMessageModal = true;
      return;
    }

    if (this.stockItems.length === 0) {
      this.title = 'No Products';
      this.message = 'Please add at least one product before submitting.';
      this.isOpenMessageModal = true;
      return;
    }
  }

  addSelectedProductsFromProductTable(
    variants: ProductVariantForTransactionModel[]
  ) {
    this.stockItems.clear();
    variants.forEach((v) => {
      this.addStockItem({
        sku: v.sku,
        name: v.name,
        quantity: 1,
        expected_price: 1000,
      });
    });
    this.refreshTable();
  }

  receiveFile(file: File) {
    console.log(file);
  }

  openModalUploadFile() {
    this.isOpenModalUploadFile = true;
  }

  closeModalUploadFile() {
    this.isOpenModalUploadFile = false;
  }

  closeModalMessageModal() {
    this.isOpenMessageModal = false;
  }

  private parseExcelBuffer(
    buffer: ArrayBuffer
  ): OrderDetailWithExpectedPrice[] | null {
    const data = new Uint8Array(buffer);
    const workbook = XLSX.read(data, { type: 'array' });

    if (!workbook.SheetNames.includes('order_detail')) {
      return null;
    }

    const worksheet = workbook.Sheets['order_detail'];
    const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

    return jsonData.map((row: any) => ({
      sku: row.sku,
      name: row.name,
      quantity: Number(row.quantity) || 0,
      expected_price: Number(row.expected_price) || 0,
    }));
  }

  openWarningModal() {
    this.isOpenWarningModal = true;
    this.title = 'Warning';
    this.message = 'Please check order carefully';
  }

  closeWarningModal() {
    this.isOpenWarningModal = false;
    this.title = '';
    this.message = '';
  }
}
