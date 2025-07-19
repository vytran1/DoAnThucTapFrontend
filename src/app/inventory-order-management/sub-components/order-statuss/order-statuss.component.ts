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
  ],
  templateUrl: './order-statuss.component.html',
  styleUrl: './order-statuss.component.css',
})
export class OrderStatussComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  @Input()
  orderId!: number;
  isOpenStatusList = false;

  statusHistory: OrderDetailStatus[] = [];

  statusList: string[] = [
    'ACCEPTED_PRICE',
    'REJECT_PRICE',
    'REJECT_ORDER',
    'PAYING',
    'CHECKED',
    'FINISH',
  ];

  constructor(private inventoryOrderService: InventoryOrderService) {}

  ngOnInit(): void {
    if (this.orderId) {
      this.inventoryOrderService.getStatus(this.orderId).subscribe({
        next: (response) => {
          this.statusHistory = response.body;
        },
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
    console.log(status);
  }

  onCancel() {
    this.isOpenStatusList = false;
  }
}
