import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReportRequest } from '../../../../model/reports/report-request.model';
import { ReportItem } from '../../../../model/reports/report-item.model';
import { ReportService } from '../../../../services/report.service';
import { AuthService } from '../../../../services/auth.service';
import { LoadingComponent } from '../../../../shared-component/loading/loading.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { InventoryDropDownListComponent } from '../../../../shared-component/inventory-drop-down-list/inventory-drop-down-list.component';
import { BaseChartDirective } from 'ng2-charts';

import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { ReportChartItem } from '../../../../model/reports/report-chart-item.model';

type GroupByType = 'DAY' | 'MONTH' | 'YEAR';
@Component({
  selector: 'app-report-by-custom-date',
  standalone: true,
  imports: [
    LoadingComponent,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    InventoryDropDownListComponent,
    BaseChartDirective,
  ],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './report-by-custom-date.component.html',
  styleUrl: './report-by-custom-date.component.css',
})
export class ReportByCustomDateComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  reportRequest: ReportRequest = {
    type: 'CUSTOM', // New type for custom date range reports
  };
  startDate: Date | null = null;
  endDate: Date = new Date();
  groupBy: GroupByType = 'MONTH';

  originalItems: ReportItem[] = [];
  isAdmin = false;

  reportData: any;
  total!: number;
  loading: boolean = false;
  error: string | null = null;

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Revenue',
        backgroundColor: '#2f855a',
        hoverBackgroundColor: '#38a169',
      },
    ],
  };

  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context) => {
            const dataIndex = context.dataIndex;
            const value = this.barChartData.datasets[0].data[dataIndex];
            const label = this.barChartData.labels![dataIndex] as string;

            const foundItem = this.currentFilteredItems.find(
              (item) => item.name === label
            );
            const invoiceCount = foundItem?.invoiceCount || 0;

            return `Value: ${Number(value).toLocaleString('en-US', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })} VND | Invoices: ${invoiceCount}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: true,
        },
        beginAtZero: true,
      },
    },
  };
  barChartType: 'bar' = 'bar';
  private currentFilteredItems: ReportChartItem[] = [];
  constructor(
    private reportService: ReportService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isSuperAdmin();
    // Initial data load for the last 30 days
    this.startDate = new Date();
    this.startDate.setDate(this.startDate.getDate() - 30);
    this.fetchData(null);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  fetchData(inventoryId: number | null): void {
    this.loading = true;
    this.reportRequest.inventory_id = inventoryId;
    this.reportRequest.start_date =
      this.startDate?.toISOString().slice(0, 10) || undefined;
    this.reportRequest.end_date = this.endDate.toISOString().slice(0, 10);
    this.reportRequest.type = 'CUSTOM';

    const fetchMethod = this.isAdmin
      ? this.reportService.fetchRevenueReportDataForAdmin(this.reportRequest)
      : this.reportService.fetchRevenueReportDataForDirector(
          this.reportRequest
        );

    const sub = fetchMethod.subscribe({
      next: (res) => {
        this.originalItems = res.body.items;
        this.total = res.body.total_values;
        this.reportData = res.body;
        this.loading = false;
        this.processAndDisplayData();
      },
      error: (err) => {
        console.log(err);
        this.error = 'Failed to fetch data';
        this.loading = false;
      },
    });

    this.subscriptions.push(sub);
  }

  onApplyFilter(): void {
    this.fetchData(this.reportRequest.inventory_id || null);
  }

  processAndDisplayData(): void {
    let groupedData: ReportChartItem[] = [];

    switch (this.groupBy) {
      case 'DAY':
        groupedData = this._groupItemsByDay(this.originalItems);
        break;
      case 'MONTH':
        groupedData = this._groupItemsByMonth(this.originalItems);
        break;
      case 'YEAR':
        groupedData = this._groupItemsByYear(this.originalItems);
        break;
      default:
        groupedData = this._groupItemsByMonth(this.originalItems);
    }

    this._updateChartData(groupedData);
  }

  private _groupItemsByDay(items: ReportItem[]): ReportChartItem[] {
    const dayMap = new Map<
      string,
      { totalValue: number; itemCounts: number }
    >();
    items.forEach((item) => {
      const date = new Date(item.date);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string from API:', item.date);
        return;
      }
      const key = `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      const current = dayMap.get(key) || { totalValue: 0, itemCounts: 0 };
      dayMap.set(key, {
        totalValue: current.totalValue + parseFloat(item.value),
        itemCounts: current.itemCounts + 1,
      });
    });
    return Array.from(dayMap.entries())
      .map(([name, { totalValue, itemCounts }]) => ({
        name,
        value: totalValue,
        invoiceCount: itemCounts,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  private _groupItemsByMonth(items: ReportItem[]): ReportChartItem[] {
    const monthMap = new Map<
      string,
      { totalValue: number; itemCounts: number }
    >();
    items.forEach((item) => {
      const date = new Date(item.date);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string from API:', item.date);
        return;
      }
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const current = monthMap.get(key) || { totalValue: 0, itemCounts: 0 };
      monthMap.set(key, {
        totalValue: current.totalValue + parseFloat(item.value),
        itemCounts: current.itemCounts + 1,
      });
    });
    return Array.from(monthMap.entries())
      .map(([key, { totalValue, itemCounts }]) => {
        const [year, month] = key.split('-').map(Number);
        return {
          name: new Date(year, month).toLocaleString('default', {
            month: 'short',
            year: 'numeric',
          }),
          value: totalValue,
          invoiceCount: itemCounts,
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  private _groupItemsByYear(items: ReportItem[]): ReportChartItem[] {
    const yearMap = new Map<
      string,
      { totalValue: number; itemCounts: number }
    >();
    items.forEach((item) => {
      const date = new Date(item.date);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string from API:', item.date);
        return;
      }
      const key = `${date.getFullYear()}`;
      const current = yearMap.get(key) || { totalValue: 0, itemCounts: 0 };
      yearMap.set(key, {
        totalValue: current.totalValue + parseFloat(item.value),
        itemCounts: current.itemCounts + 1,
      });
    });
    return Array.from(yearMap.entries())
      .map(([name, { totalValue, itemCounts }]) => ({
        name,
        value: totalValue,
        invoiceCount: itemCounts,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  private _updateChartData(filteredItems: ReportChartItem[]): void {
    this.barChartData = {
      labels: filteredItems.map((item) => item.name),
      datasets: [
        {
          data: filteredItems.map((item) => item.value),
          label: 'Revenue',
          backgroundColor: '#2f855a',
          hoverBackgroundColor: '#38a169',
        },
      ],
    };
    this.currentFilteredItems = filteredItems;
  }
}
