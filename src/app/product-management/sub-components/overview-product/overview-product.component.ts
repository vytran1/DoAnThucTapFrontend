import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Subscription } from 'rxjs';
import { ProductService } from '../../../services/product.service';
import { ProductOverviewModel } from '../../../model/product/product-overview.model';
import { LoadingComponent } from '../../../shared-component/loading/loading.component';
@Component({
  selector: 'app-overview-product',
  standalone: true,
  imports: [MatCardModule, LoadingComponent],
  templateUrl: './overview-product.component.html',
  styleUrl: './overview-product.component.css',
})
export class OverviewProductComponent implements OnInit, OnDestroy {
  @Input()
  productId!: number;

  productOverview!: ProductOverviewModel;

  subscriptions: Subscription[] = [];

  isLoading = false;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.subscriptions.push(
      this.productService.getProductDetailsById(this.productId).subscribe({
        next: (response) => {
          this.productOverview = response.body;
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
