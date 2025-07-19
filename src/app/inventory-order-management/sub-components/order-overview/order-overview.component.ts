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
  ],
  templateUrl: './order-overview.component.html',
  styleUrl: './order-overview.component.css',
})
export class OrderOverviewComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  @Input()
  orderId!: number;

  constructor(private inventoryOrderService: InventoryOrderService) {}

  ngOnInit(): void {
    if (this.orderId) {
      const sub = this.inventoryOrderService
        .getOverview(this.orderId)
        .subscribe({
          next: (response) => {
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
          },
        });

      this.subscriptions.push(sub);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
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
