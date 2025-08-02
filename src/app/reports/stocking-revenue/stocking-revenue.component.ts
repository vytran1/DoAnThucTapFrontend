import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReportStockItem } from '../../model/reports/report-stock-item.model';
import { AuthService } from '../../services/auth.service';
import { ReportService } from '../../services/report.service';
import { InventoryDropDownListComponent } from '../../shared-component/inventory-drop-down-list/inventory-drop-down-list.component';
import { LoadingComponent } from '../../shared-component/loading/loading.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { StockTableComponent } from './sub-components/stock-table/stock-table.component';
import { PageNumComponent } from '../../shared-component/page-num/page-num.component';
import { ReportRequest } from '../../model/reports/report-request.model';

type TimeStrategy = 'WEEK' | 'MONTH' | 'YEAR';

@Component({
  selector: 'app-stocking-revenue',
  standalone: true,
  imports: [
    InventoryDropDownListComponent,
    LoadingComponent,
    CommonModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    StockTableComponent,
    PageNumComponent,
  ],
  templateUrl: './stocking-revenue.component.html',
  styleUrl: './stocking-revenue.component.css',
})
export class StockingRevenueComponent implements OnInit, OnDestroy {
  isLoading = true;
  subscriptions: Subscription[] = [];
  stockings: ReportStockItem[] = [];
  totalValues: number = 0;
  isDirector = false;
  isSuperAdmin = false;
  inventoryCode: string = '';
  selectedInventoryId: number | null = null;

  timeStrategy: TimeStrategy = 'WEEK';

  reportRequest: ReportRequest = {
    type: this.timeStrategy,
  };

  pageNum = 1;
  pageSize = 50;
  totalPage = 0;
  totalItems = 0;
  inventoryId: number | null = null;

  constructor(
    private authService: AuthService,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.selectedInventoryId = this.authService.getInventoryId();
    this.inventoryCode = this.authService.getInventoryCode();
    this.isDirector = this.authService.isDirector();
    this.isSuperAdmin = this.authService.isSuperAdmin();
    this.inventoryId = this.authService.getInventoryId();

    this.reportService.setInventoryId(this.inventoryId);
    this.reportService.setPageNum(this.pageNum);
    this.reportService.setPageSize(this.pageSize);

    const sub = this.reportService.changesTrigger$.subscribe({
      next: (response) => {
        console.log(response);
        this.handleResponse(response.body);
      },
      error: (err) => {
        console.log(err);
        console.error('Error loading stocking data:', err);
      },
    });

    this.subscriptions.push(sub);
    this.loadChartData();
    this.isLoading = false;
  }

  loadChartData() {
    const request: ReportRequest = {
      type: this.timeStrategy,
      inventory_id: this.selectedInventoryId, // ✅ luôn gửi theo dropdown chọn
    };

    const sub = this.reportService.getImportAndSaleReport(request).subscribe({
      next: ([importRes, saleRes]) => {
        console.log('Importing Response', importRes);
        console.log('Sales Response', saleRes);

        const importingData = importRes.body?.items || [];
        const sellingData = saleRes.body?.items || [];

        console.log('Importing Data', importingData);
        console.log('Selling Data', sellingData);
      },
      error: (err) => {
        console.error('Error loading import/sale report', err);
      },
    });

    this.subscriptions.push(sub);
  }

  // private loadStockingData(): void {
  //   const sub = this.reportService
  //     .getStockingReport(this.inventoryId, this.pageNum, this.pageSize)
  //     .subscribe({
  //       next: (response) => this.handleResponse(response.body),
  //       error: (err) => console.error('Error loading stocking data:', err),
  //     });

  //   this.subscriptions.push(sub);
  // }

  private handleResponse(data: any): void {
    console.log('Stock Revenue', data);

    this.stockings = data?.stockings || [];
    console.log('Data', this.stockings);
    this.totalValues = data?.total_values || 0;
    this.totalPage = data?.page_dto?.totalPages || 0;
    this.totalItems = data?.page_dto?.totalItems || 0;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  onSelectionChange(id: number) {
    this.reportService.setInventoryId(id);
  }

  onPageChangeEvent(pageNum: number) {
    this.reportService.setPageNum(pageNum);
  }

  selectAll(id: number) {
    this.reportService.setInventoryId(null);
  }
}
