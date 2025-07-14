import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ProductVariantDetailModel } from '../../../model/product/product-variant-detail.model';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ProductService } from '../../../services/product.service';
import { ProductAttributeForVariantInfoModel } from '../../../model/product/product-attribute-for-variantinfo.model';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-product-variants',
  standalone: true,
  imports: [
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    CurrencyPipe,
    CommonModule,
  ],
  templateUrl: './product-variants.component.html',
  styleUrl: './product-variants.component.css',
})
export class ProductVariantsComponent implements OnInit, OnDestroy {
  @Input()
  productId!: number;
  variants: ProductVariantDetailModel[] = [];
  attributes: ProductAttributeForVariantInfoModel[] = [];
  subscriptions: Subscription[] = [];

  displayedColumns: string[] = ['name', 'sku', 'price'];

  dataSource: ProductVariantDetailModel[] = [
    {
      name: 'LEGIONS5-15ACH6-2021 / RED / 512GB / 15',
      sku: 'LEGI15ACH621_1',
      price: 15,
      isDefault: true,
    },
    {
      name: 'LEGIONS5-15ACH6-2021 / BLUE / 1TB / 17',
      sku: 'LEGI15ACH621_2',
      price: 10,
    },
    {
      name: 'LEGIONS5-15ACH6-2021 / GREEN / 2TB / 15',
      sku: 'LEGI15ACH621_3',
      price: 10,
    },
  ].map((variant) => ({
    ...variant,
    attributes: this.extractAttributes(variant.name),
  }));

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.productService
        .getProductVariantDetailsById(this.productId)
        .subscribe({
          next: (response) => {
            console.log(response);
            this.attributes = response.body.attribute;

            this.displayedColumns = [
              'name',
              'sku',
              'price',
              ...this.attributes.map((attr) => attr.name.toLowerCase()),
            ];

            this.variants = response.body.variants.map((v: any) => ({
              ...v,
              attributes: this.extractAttributes(v.name),
            }));

            this.dataSource = this.variants;

            console.log('Data Source', this.dataSource);
          },
          error: (err) => {
            console.log(err);
          },
          complete: () => {},
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  extractAttributes(name: string): { [key: string]: string } {
    const parts = name.split('/');
    const valuesOnly = parts.slice(1);
    const attributeMap: { [key: string]: string } = {};

    this.attributes.forEach((attr, index) => {
      const key = attr.name.toLowerCase();
      attributeMap[key] = valuesOnly[index] ?? '';
    });

    return attributeMap;
  }
}
