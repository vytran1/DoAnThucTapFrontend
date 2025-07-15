import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { ProductVariantInventoryModel } from '../../../model/product/product-variant-inventory.model';
import { ProductService } from '../../../services/product.service';
import { Subscription } from 'rxjs';
import { LoadingComponent } from '../../../shared-component/loading/loading.component';

@Component({
  selector: 'app-product-inventory',
  standalone: true,
  imports: [
    MatTableModule,
    MatCardModule,
    CommonModule,
    CurrencyPipe,
    LoadingComponent,
  ],
  templateUrl: './product-inventory.component.html',
  styleUrl: './product-inventory.component.css',
})
export class ProductInventoryComponent implements OnInit, OnDestroy {
  @Input()
  productId!: number;

  subscriptions: Subscription[] = [];

  displayedColumns: string[] = ['product_name', 'sku', 'price', 'onhand'];

  dataSource: ProductVariantInventoryModel[] = [];

  isLoading = true;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    if (this.productId) {
      this.subscriptions.push(
        this.productService
          .getProductVariantDetailsWithInventoryInformation(this.productId)
          .subscribe({
            next: (response) => {
              this.dataSource = response.body;
            },
          })
      );
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {}
}
