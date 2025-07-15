import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StockingService } from '../../../services/stocking.service';
import { Subscription } from 'rxjs';
import { StockingProductSearchModel } from '../../../model/stocking/stocking-product-search.model';
import { MessageModalComponent } from '../../../shared-component/message-modal/message-modal.component';

@Component({
  selector: 'app-product-search',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    FormsModule,
    CommonModule,
    MessageModalComponent,
  ],
  templateUrl: './product-search.component.html',
  styleUrl: './product-search.component.css',
})
export class ProductSearchComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  skuCode: string = '';
  displayedColumns: string[] = ['inventoryCode', 'quantity'];
  stockResults: StockingProductSearchModel[] = [];

  isOpenMessageModal = false;
  title = '';
  message = '';

  constructor(private stockingService: StockingService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  onSearch() {
    // TODO: Replace with actual API call
    this.subscriptions.push(
      this.stockingService.getStockingOfProduct(this.skuCode).subscribe({
        next: (response) => {
          this.stockResults = response.body;
        },
        error: (err) => {
          this.title = 'NOT FOUND';
          this.message = 'Not Exist Product Variant With The Given Sku Code';
          this.isOpenMessageModal = true;
        },
      })
    );
  }

  closeModal() {
    this.title = '';
    this.message = '';
    this.isOpenMessageModal = false;
  }
}
