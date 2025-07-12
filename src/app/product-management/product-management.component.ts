import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { ProductByPageModel } from '../model/product/product-by-page.model';
import { ProductService } from '../services/product.service';
import { PageNumComponent } from '../shared-component/page-num/page-num.component';
import { OverviewProductComponent } from './sub-components/overview-product/overview-product.component';
import { ProductVariantsComponent } from './sub-components/product-variants/product-variants.component';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    PageNumComponent,
    RouterModule,
  ],
  templateUrl: './product-management.component.html',
  styleUrl: './product-management.component.css',
})
export class ProductManagementComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  productList: ProductByPageModel[] = [];

  pageNum = 1;
  pageSize = 2;
  sortField = 'id';
  sortDir = 'asc';
  totalPage = 0;
  totalItems = 0;

  constructor(private router: Router, private productService: ProductService) {}
  displayedColumns: string[] = [
    'image',
    'name',
    'sku',
    'brand',
    'category',
    'action',
  ];

  products = [
    {
      imageUrl: 'https://via.placeholder.com/40',
      name: 'LEGION5 2022',
      sku: 'LG5_2022',
      brandName: 'Lenovo',
      categoryName: 'Laptop',
    },
    {
      imageUrl: 'https://via.placeholder.com/40',
      name: 'MacBook Pro',
      sku: 'MBP_M3',
      brandName: 'Apple',
      categoryName: 'Laptop',
    },
  ];

  ngOnInit(): void {
    this.subscriptions.push(
      this.productService.products$.subscribe((response) => {
        this.productList = response;
      })
    );

    this.subscriptions.push(
      this.productService.totalPage$.subscribe((response) => {
        this.totalPage = response;
      })
    );

    this.subscriptions.push(
      this.productService.totalItems$.subscribe((response) => {
        this.totalItems = response;
      })
    );
  }

  ngOnDestroy(): void {}

  redirectToCreateForm() {
    this.router.navigateByUrl('/inventory/create-product');
  }

  onPageChange(event: number) {
    this.productService.updatePageNum(event);
  }
}
