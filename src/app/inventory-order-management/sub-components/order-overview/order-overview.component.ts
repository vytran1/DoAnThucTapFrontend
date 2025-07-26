import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { InventoryOrderService } from '../../../services/inventory-order.service';
import { Subscription } from 'rxjs';
import { OrderDetailForOverview } from '../../../model/inventory-order/order-detail-for-overview.model';
import { OrderOverview } from '../../../model/inventory-order/order-overview.model';
import { Router } from '@angular/router';
import { MessageModalComponent } from '../../../shared-component/message-modal/message-modal.component';
import { LoadingComponent } from '../../../shared-component/loading/loading.component';

@Component({
  selector: 'app-order-overview',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MessageModalComponent,
    LoadingComponent,
  ],
  templateUrl: './order-overview.component.html',
  styleUrl: './order-overview.component.css',
})
export class OrderOverviewComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  @Input()
  orderId!: number;

  isLoading = true;
  isOpenMessageModal = false;
  title = '';
  message = '';

  constructor(
    private inventoryOrderService: InventoryOrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.orderId) {
      const sub = this.inventoryOrderService
        .getOverview(this.orderId)
        .subscribe({
          next: (response) => {
            this.title = '';
            this.message = '';
            this.isOpenMessageModal = false;
            this.isLoading = false;
            console.log(response);
            const body = response.body;

            this.dataSource = body.order_details;

            // Gán thông tin tổng quan (dữ liệu bên phải và trái)
            this.generalInformation = {
              order_code: body.order_code,
              employee: body.employee,
              current_status: body.current_status,
              created_at: body.created_at,
              completed_at: body.completed_at,
              line_items: body.line_items,
            };
          },
          error: (err) => {
            console.log(err);
            this.title = 'ERROR';
            this.message = err.error;
            this.isOpenMessageModal = true;
          },
        });

      this.subscriptions.push(sub);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  closeMessageModal() {
    this.title = '';
    this.message = '';
    this.isOpenMessageModal = false;
    this.router.navigateByUrl('/inventory/order-management');
  }

  dataSource: OrderDetailForOverview[] = [];
  generalInformation!: OrderOverview;

  displayedColumns: string[] = [
    'sku',
    'quantity',
    'costPrice',
    'quotePrice',
    'expectedPrice',
    'totalCostPrice',
  ];
}
