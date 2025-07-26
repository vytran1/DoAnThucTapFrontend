import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { ProductVariantWithStock } from '../../model/product/product-variant-with-stock.model';
import { SearchingService } from '../../services/searching.service';
import { CategoryDropDownModel } from '../../model/category/category-dropdown-list.model';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <-- For ngModel
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon'; // optional if you use icons
import { MatCardModule } from '@angular/material/card';
import { PageNumComponent } from '../page-num/page-num.component';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-search-variant-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, // For ngModel
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatDialogModule,
    MatIconModule,
    MatCardModule,
    PageNumComponent,
  ],
  templateUrl: './search-variant-table.component.html',
  styleUrl: './search-variant-table.component.css',
})
export class SearchVariantTableComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  displayedColumns: string[] = ['sku', 'name', 'quantity', 'price', 'action'];
  dataSource: ProductVariantWithStock[] = [];
  categories: CategoryDropDownModel[] = [];
  nameFilter = '';
  selectedCategoryId: number | null = null;

  pageNum = 1;
  pageSize = 50;
  sortField = 'id';
  sortDir = 'asc';
  totalPage = 0;
  totalItems = 0;

  @Output() addToCart = new EventEmitter<ProductVariantWithStock>();
  @Output() close = new EventEmitter<void>();

  constructor(
    private searchService: SearchingService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.dataSource = [];

    this.subscriptions.push(
      this.categoryService
        .getCategoriesForDropDownList()
        .subscribe((res: any) => {
          this.categories = res.body;
        })
    );

    const sub = this.searchService.searchTrigger$.subscribe((res: any) => {
      console.log(res);
      this.dataSource = res.body.variants;
      this.pageNum = res.body.page.pageNum;
      this.pageSize = res.body.page.pageSize;
      this.sortField = res.body.page.sortField;
      this.sortDir = res.body.page.sortDir;
      this.totalItems = res.body.page.totalItems;
      this.totalPage = res.body.page.totalPages;
    });

    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  onAddToCart(item: ProductVariantWithStock) {
    console.log('Emit Item', item);
    this.addToCart.emit(item);
  }

  onCancel(): void {
    this.close.emit();
  }

  onFilter(): void {
    console.log('FILTER ' + this.nameFilter);
    this.searchService.setSearchName(this.nameFilter);
  }

  onPageChange(index: number) {
    console.log('Page Change');
    this.searchService.onPageChange(index);
  }

  onCategoryChange(categoryId: number | null): void {
    this.selectedCategoryId = categoryId;
    console.log('Category Change:', categoryId);
    this.searchService.setCategory(this.selectedCategoryId);
  }
}
