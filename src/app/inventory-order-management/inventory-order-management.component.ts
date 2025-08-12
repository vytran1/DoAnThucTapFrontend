import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { OrderPage } from '../model/inventory-order/order-page.model';
import { Subscription } from 'rxjs';
import { InventoryOrderService } from '../services/inventory-order.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { dateRangeValidator } from '../validators/sync-validator/date-range.validator';
import { CommonModule } from '@angular/common';
import { PageNumComponent } from '../shared-component/page-num/page-num.component';

@Component({
  selector: 'app-inventory-order-management',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    ReactiveFormsModule,
    CommonModule,
    PageNumComponent,
    RouterModule,
  ],
  templateUrl: './inventory-order-management.component.html',
  styleUrl: './inventory-order-management.component.css',
})
export class InventoryOrderManagementComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  form!: FormGroup;
  orders: OrderPage[] = [];

  pageNum = 1;
  pageSize = 10;
  sortField = 'id';
  sortDir = 'asc';
  totalPage = 0;
  totalItems = 0;

  filteredOrders: OrderPage[] = [];

  constructor(
    private router: Router,
    private orderService: InventoryOrderService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group(
      {
        startDate: [null],
        endDate: [null],
      },
      { validators: [dateRangeValidator()] }
    );
  }

  ngOnInit(): void {
    this.orderService.searchTrigger$.subscribe((res) => {
      console.log(res);

      this.orders = res.body.orders;
      this.pageNum = res.body.page.pageNum;
      this.pageSize = res.body.page.pageSize;
      this.sortDir = res.body.page.sortDir;
      this.sortField = res.body.page.sortField;
      this.totalPage = res.body.page.totalPages;
      this.totalItems = res.body.page.totalItems;
    });

    this.orders = [];
  }

  ngOnDestroy(): void {}

  applyFilter() {
    if (this.form.invalid) {
      return;
    }

    const startDate = this.form.get('startDate')?.value;
    const endDate = this.form.get('endDate')?.value;

    const start = startDate ? startDate.toISOString() : null;
    const end = endDate ? endDate.toISOString() : null;

    console.log(start);
    console.log(end);

    this.orderService.setDate(start, end);
  }

  redirectToCreateForm() {
    this.router.navigateByUrl('/inventory/create-order');
  }

  onPageChange(page: number) {
    this.orderService.onPageChange(page);
  }
}
