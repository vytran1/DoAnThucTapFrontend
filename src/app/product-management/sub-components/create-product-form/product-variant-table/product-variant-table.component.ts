import { Component, Input } from '@angular/core';
import { ProductVariantModel } from '../../../../model/product/product-variant-table.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-variant-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-variant-table.component.html',
  styleUrl: './product-variant-table.component.css',
})
export class ProductVariantTableComponent {
  @Input()
  variants: ProductVariantModel[] = [];
}
