import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ProductVariantForTransactionModel } from '../../model/product/product-variant-for-transaction.model';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTab } from '@angular/material/tabs';
import { PageNumComponent } from '../page-num/page-num.component';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../services/category.service';
import { Subscription } from 'rxjs';
import { CategoryDropDownModel } from '../../model/category/category-dropdown-list.model';
import { ProductVariantService } from '../../services/product-variant.service';
import { MessageModalComponent } from '../message-modal/message-modal.component';
interface ProductVariant {
  sku: string;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

@Component({
  selector: 'app-product-table',
  standalone: true,
  imports: [
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTab,
    PageNumComponent,
    MatCardModule,
    MatCheckboxModule,
    CommonModule,
    MessageModalComponent,
  ],
  templateUrl: './product-table.component.html',
  styleUrl: './product-table.component.css',
})
export class ProductTableComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  @Output()
  itemEmitter = new EventEmitter<ProductVariantForTransactionModel[]>();
  @Output()
  close = new EventEmitter<void>();

  pageNum = 1;
  pageSize = 50;
  sortField = 'id';
  sortDir = 'asc';
  totalPage = 0;
  totalItems = 0;
  searchName = '';
  categories: CategoryDropDownModel[] = [];
  selectedCategoryId: number | null = null;

  isOpenMessageModel = false;
  title = '';
  message = '';

  allProducts: ProductVariantForTransactionModel[] = [];
  filteredProducts: ProductVariantForTransactionModel[] = [];
  selectedProducts: ProductVariantForTransactionModel[] = [];

  constructor(
    private categoriesService: CategoryService,
    private productVariantService: ProductVariantService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.categoriesService.getCategoriesForDropDownList().subscribe({
        next: (response) => {
          console.log(response);
          this.categories = response.body;
        },
      })
    );

    this.subscriptions.push(
      this.productVariantService.productVariant$.subscribe((response) => {
        this.filteredProducts = response;
      })
    );

    this.subscriptions.push(
      this.productVariantService.totalItems$.subscribe((response) => {
        this.totalItems = response;
      })
    );

    this.subscriptions.push(
      this.productVariantService.totalPage$.subscribe((response) => {
        this.totalPage = response;
      })
    );

    // Mặc định hiển thị tất cả
    // this.filteredProducts = [...this.allProducts];
  }

  loadData() {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  onCategoryChange(): void {
    console.log('Selected Category ID:', this.selectedCategoryId);
    this.productVariantService.setCategory(this.selectedCategoryId);
  }
  onFilter() {
    console.log(this.searchName);
    this.productVariantService.setSearchName(this.searchName);
  }

  onPageChange(page: number) {
    console.log(page);
    this.productVariantService.onPageChange(page);
  }

  isSelected(row: ProductVariant): boolean {
    return this.selectedProducts.includes(row);
  }

  toggleSelection(row: ProductVariant): void {
    const index = this.selectedProducts.indexOf(row);
    if (index >= 0) {
      this.selectedProducts.splice(index, 1);
    } else {
      this.selectedProducts.push(row);
    }
  }

  toggleAll(event: any): void {
    if (event.checked) {
      this.selectedProducts = [...this.filteredProducts];
    } else {
      this.selectedProducts = [];
    }
  }

  isAllSelected(): boolean {
    return (
      this.selectedProducts.length === this.filteredProducts.length &&
      this.filteredProducts.length > 0
    );
  }

  addStock(): void {
    console.log('Selected Products:', this.selectedProducts);
    if (this.selectedProducts.length == 0) {
      this.title = 'ERROR';
      this.message = 'Please choose at least one product';
      this.isOpenMessageModel = true;
      return;
    }
    this.itemEmitter.emit(this.selectedProducts);
  }

  closeForm() {
    this.close.emit();
  }

  closeModalMessage() {
    this.isOpenMessageModel = false;
  }
}
