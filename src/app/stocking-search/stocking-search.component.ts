import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ProductSearchComponent } from './sub-components/product-search/product-search.component';
import { InventorySearchComponent } from './sub-components/inventory-search/inventory-search.component';

@Component({
  selector: 'app-stocking-search',
  standalone: true,
  imports: [MatTabsModule, ProductSearchComponent, InventorySearchComponent],
  templateUrl: './stocking-search.component.html',
  styleUrl: './stocking-search.component.css',
})
export class StockingSearchComponent {
  tabs = [{ label: 'Product Search' }, { label: 'Inventory Search' }];

  selectedIndex = 0;
}
