import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { InventoryOrderService } from '../../../services/inventory-order.service';
import { LoadingComponent } from '../../../shared-component/loading/loading.component';
import { QuoteView } from '../../../model/inventory-order/quote-view.model';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { WarningModalComponent } from '../../../shared-component/warning-modal/warning-modal.component';
import { MessageModalComponent } from '../../../shared-component/message-modal/message-modal.component';
@Component({
  selector: 'app-order-quote-price',
  standalone: true,
  imports: [
    LoadingComponent,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    CommonModule,
    WarningModalComponent,
    MessageModalComponent,
  ],
  templateUrl: './order-quote-price.component.html',
  styleUrl: './order-quote-price.component.css',
})
export class OrderQuotePriceComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  @Input()
  orderId!: number;

  isLoading = false;

  quoteView: QuoteView | null = null;

  isOpenWarningModal = false;
  titleForWarningModal: string = '';
  messageForWarningModal: string = '';

  isOpenMessageModal = false;
  titleForMessageModel: string = '';
  messageForMessageModal: string = '';

  isAcceptOperation = false;

  quoteInfoDisplayedColumns: string[] = [
    'company_name',
    'email',
    'quotation_date',
  ];
  quoteItemDisplayedColumns: string[] = [
    'sku',
    'product_name',
    'quoted_price',
    'currency',
  ];
  orderDetailDisplayedColumns: string[] = [
    'name',
    'sku',
    'quantity',
    'cost_price',
    'quote_price',
    'expected_price',
  ];

  constructor(private inventoryOrderService: InventoryOrderService) {}

  ngOnInit(): void {
    this.isLoading = true;
    if (this.orderId) {
      this.subscriptions.push(
        this.inventoryOrderService.getQuote(this.orderId).subscribe({
          next: (response) => {
            console.log(response);
            this.quoteView = response.body;
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
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  callOperation() {
    if (this.isAcceptOperation) {
      this.acceptPrice();
    } else {
      this.rejectPrice();
    }
  }

  acceptPrice() {
    console.log('Accepted quote');
    this.closeWarningModal();
    this.subscriptions.push(
      this.inventoryOrderService
        .acceptQuotationByWarehouse(this.orderId)
        .subscribe({
          next: (response) => {
            this.titleForMessageModel = 'RESULT';
            this.messageForMessageModal = 'Accept Price Successfully';
            this.isOpenMessageModal = true;
          },
          error: (err) => {
            console.log(err);
            this.titleForMessageModel = 'ERROR';
            this.messageForMessageModal = err.error;
            this.isOpenMessageModal = true;
          },
        })
    );
  }

  rejectPrice() {
    console.log('Rejected quote');
    this.closeWarningModal();
    this.subscriptions.push(
      this.inventoryOrderService
        .rejectQuotationByWarehouse(this.orderId)
        .subscribe({
          next: (response) => {
            this.titleForMessageModel = 'RESULT';
            this.messageForMessageModal = 'Reject Price Successfully';
            this.isOpenMessageModal = true;
          },
          error: (err) => {
            console.log(err);
            this.titleForMessageModel = 'ERROR';
            this.messageForMessageModal = err.error;
            this.isOpenMessageModal = true;
          },
        })
    );
  }

  openWarningModal(title: string, message: string, isAcceptOperation: boolean) {
    this.titleForWarningModal = title;
    this.messageForWarningModal = message;
    this.isAcceptOperation = isAcceptOperation;
    this.isOpenWarningModal = true;
  }

  closeWarningModal() {
    this.isOpenWarningModal = false;
  }

  closeMessageModel() {
    this.isOpenMessageModal = false;
  }
}
