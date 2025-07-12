import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { OverviewProductComponent } from '../overview-product/overview-product.component';
import { ProductVariantsComponent } from '../product-variants/product-variants.component';
import { ProductImagesComponent } from '../product-images/product-images.component';
import { ProductInventoryComponent } from '../product-inventory/product-inventory.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-information',
  standalone: true,
  imports: [
    MatTabsModule,
    OverviewProductComponent,
    ProductVariantsComponent,
    ProductImagesComponent,
    ProductInventoryComponent,
  ],
  templateUrl: './product-information.component.html',
  styleUrl: './product-information.component.css',
})
export class ProductInformationComponent implements OnInit {
  productId!: number;
  tabs = [
    { label: 'Overview' },
    { label: 'Variants' },
    { label: 'Images' },
    { label: 'Inventory' },
  ];

  constructor(private activeRoute: ActivatedRoute) {}

  selectedIndex = 0;

  ngOnInit(): void {
    this.productId = Number(
      this.activeRoute.snapshot.paramMap.get('productId')
    );
  }
}
