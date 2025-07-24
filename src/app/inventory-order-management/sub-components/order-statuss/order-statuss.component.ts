import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { StatusListComponent } from '../../../shared-component/status-list/status-list.component';
import { OrderDetailStatus } from '../../../model/status/order-detail-status.model';
import { Subscription } from 'rxjs';
import { InventoryOrderService } from '../../../services/inventory-order.service';
import { MessageModalComponent } from '../../../shared-component/message-modal/message-modal.component';
@Component({
  selector: 'app-order-statuss',
  standalone: true,
  imports: [
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    StatusListComponent,
    MessageModalComponent,
  ],
  templateUrl: './order-statuss.component.html',
  styleUrl: './order-statuss.component.css',
})
export class OrderStatussComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  @Input()
  orderId!: number;
  isOpenStatusList = false;

  isOpenMessageModal = false;
  title = '';
  message = '';

  statusHistory: OrderDetailStatus[] = [];

  statusList: string[] = ['REJECT_ORDER', 'PAYING', 'CHECKED', 'FINISH'];

  constructor(private inventoryOrderService: InventoryOrderService) {}

  ngOnInit(): void {
    if (this.orderId) {
      this.inventoryOrderService.getStatus(this.orderId).subscribe({
        next: (response) => {
          this.statusHistory = response.body;
        },
        error: (err) => {},
      });
    }
  }

  ngOnDestroy(): void {}

  onUpdateStatus() {
    console.log('Updating status...');
  }

  onOpenStatusList() {
    this.isOpenStatusList = true;
  }

  onSubmit(status: string) {
    this.isOpenStatusList = false;
    console.log(status);
    switch (status) {
      case 'REJECT_ORDER':
        this.rejectOrder();
        break;
      case 'PAYING':
        this.updatePayingStatus();
        break;
      case 'CHECKED':
        this.updateCheckedStatus();
        break;
      case 'FINISH':
        this.updateFinishStatus();
        break;
    }
  }

  rejectOrder() {
    this.subscriptions.push(
      this.inventoryOrderService.rejectOrder(this.orderId).subscribe({
        next: (response) => {
          this.statusHistory.push(response.body);
          this.title = 'RESULT';
          this.message = 'Successfully updating status of Order';
          this.isOpenMessageModal = true;
        },
        error: (err) => {
          this.title = 'ERROR';
          this.message = err.error;
          this.isOpenMessageModal = true;
        },
      })
    );
  }

  updatePayingStatus() {
    this.subscriptions.push(
      this.inventoryOrderService.payingOrder(this.orderId).subscribe({
        next: (response) => {
          this.statusHistory.push(response.body);
          this.title = 'RESULT';
          this.message = 'Successfully updating status of Order';
          this.isOpenMessageModal = true;
        },
        error: (err) => {
          this.title = 'ERROR';
          this.message = err.error;
          this.isOpenMessageModal = true;
        },
      })
    );
  }

  updateCheckedStatus() {
    this.subscriptions.push(
      this.inventoryOrderService.updateCheckedStatus(this.orderId).subscribe({
        next: (response) => {
          this.statusHistory.push(response.body);
          this.title = 'RESULT';
          this.message = 'Successfully updating status of Order';
          this.isOpenMessageModal = true;
        },
        error: (err) => {
          this.title = 'ERROR';
          this.message = err.error;
          this.isOpenMessageModal = true;
        },
      })
    );
  }

  updateFinishStatus() {
    this.subscriptions.push(
      this.inventoryOrderService.updateFinishStatus(this.orderId).subscribe({
        next: (response) => {
          this.statusHistory.push(response.body);
          this.title = 'RESULT';
          this.message = 'Successfully updating status of Order';
          this.isOpenMessageModal = true;
        },
        error: (err) => {
          this.title = 'ERROR';
          this.message = err.error;
          this.isOpenMessageModal = true;
        },
      })
    );
  }

  onCancel() {
    this.isOpenStatusList = false;
  }

  isRejectedOrder(): boolean {
    return this.statusHistory.some((item) => item.status === 'REJECT_ORDER');
  }

  isReviewedReject(): boolean {
    return this.statusHistory.some((item) => item.status === 'REVIEWED_REJECT');
  }

  shouldDisableUpdate(): boolean {
    return this.isRejectedOrder() || this.isReviewedReject();
  }

  closeModalMessage() {
    this.isOpenMessageModal = false;
  }
}
