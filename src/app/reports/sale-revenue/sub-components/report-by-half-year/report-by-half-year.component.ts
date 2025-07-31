import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReportRequest } from '../../../../model/reports/report-request.model';
import { ReportChartItem } from '../../../../model/reports/report-chart-item.model';
import { ReportService } from '../../../../services/report.service';
import { AuthService } from '../../../../services/auth.service';
import { ReportItem } from '../../../../model/reports/report-item.model';
import { LoadingComponent } from '../../../../shared-component/loading/loading.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { InventoryDropDownListComponent } from '../../../../shared-component/inventory-drop-down-list/inventory-drop-down-list.component';
import { BaseChartDirective } from 'ng2-charts';

import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import {
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

type HalfYearFilterType = 'ALL' | 'FIRST_QUARTER' | 'SECOND_QUARTER';

@Component({
  selector: 'app-report-by-half-year',
  standalone: true,
  imports: [
    LoadingComponent,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    InventoryDropDownListComponent,
    BaseChartDirective,
  ],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './report-by-half-year.component.html',
  styleUrl: './report-by-half-year.component.css',
})
export class ReportByHalfYearComponent implements OnInit, OnDestroy {
  halfYearFilter: HalfYearFilterType = 'ALL';
  subscriptions: Subscription[] = [];
  reportRequest: ReportRequest = {
    type: 'HALF_YEAR',
  };

  // originalItems bây giờ sẽ lưu ReportItem trực tiếp từ API
  originalItems: ReportItem[] = []; // Thay đổi kiểu dữ liệu ở đây
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
            // Lấy trực tiếp từ barChartData.datasets[0].data, vì originalItems
            // sẽ không còn khớp 1-1 sau khi tổng hợp theo tháng.
            const value = this.barChartData.datasets[0].data[dataIndex];
            const label = this.barChartData.labels![dataIndex] as string; // Lấy label (tháng/năm)

            // Tìm item trong originalItems đã được nhóm lại
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

  // Thêm một biến để lưu trữ dữ liệu đã lọc và tổng hợp cho biểu đồ,
  // bao gồm cả invoiceCount đã được tính toán.
  private currentFilteredItems: ReportChartItem[] = [];

  constructor(
    private reportService: ReportService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isSuperAdmin();

    if (this.authService.isSuperAdmin()) {
      this.fetchAdminData(null);
    } else if (this.authService.isDirector()) {
      this.fetchDirectorData();
    } else {
      this.error = 'Unauthorized role';
      console.log('Error', this.error);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  fetchAdminData(id: number | null): void {
    this.loading = true;
    this.reportRequest.inventory_id = id;

    const sub = this.reportService
      .fetchRevenueReportDataForAdmin(this.reportRequest)
      .subscribe({
        next: (res) => {
          this.halfYearFilter = 'ALL';
          console.log(res);

          // Lưu trực tiếp ReportItem gốc từ API
          this.originalItems = res.body.items; // <-- Lưu ReportItem gốc
          this.total = res.body.total_values;
          this.reportData = res.body;
          this.loading = false;

          this.applyHalfYearFilter();
        },
        error: (err) => {
          console.log(err);
          this.error = 'Failed to fetch admin data';
          this.loading = false;
        },
      });

    this.subscriptions.push(sub);
  }

  fetchDirectorData(): void {
    this.loading = true;

    const sub = this.reportService
      .fetchRevenueReportDataForDirector(this.reportRequest)
      .subscribe({
        next: (res) => {
          this.halfYearFilter = 'ALL';
          // Lưu trực tiếp ReportItem gốc từ API
          this.originalItems = res.body.items; // <-- Lưu ReportItem gốc
          this.total = res.body.total_values;
          this.reportData = res.body;
          this.loading = false;

          this.applyHalfYearFilter();
        },
        error: (err) => {
          this.error = 'Failed to fetch director data';
          this.loading = false;
        },
      });

    this.subscriptions.push(sub);
  }

  applyHalfYearFilter(): void {
    // monthMap bây giờ sẽ chứa tổng giá trị và tổng số lượng item (invoiceCount) cho mỗi tháng
    const monthMap = new Map<
      string,
      { totalValue: number; itemCounts: number }
    >();

    this.originalItems.forEach((item) => {
      const date = new Date(item.date); // Sử dụng item.date từ ReportItem
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string from API:', item.date);
        return;
      }
      const key = `${date.getFullYear()}-${date.getMonth()}`; // e.g. '2025-6'
      const current = monthMap.get(key) || { totalValue: 0, itemCounts: 0 };

      monthMap.set(key, {
        totalValue: current.totalValue + parseFloat(item.value), // Cộng dồn giá trị
        itemCounts: current.itemCounts + 1, // Đếm số lượng item trong tháng đó
      });
    });

    const sortedMonths = Array.from(monthMap.entries())
      .map(([key, { totalValue, itemCounts }]) => {
        const [year, month] = key.split('-').map(Number);
        return {
          date: new Date(year, month),
          value: totalValue,
          invoiceCount: itemCounts, // Tổng số hóa đơn cho tháng đó
        };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    const formatLabel = (date: Date) =>
      date.toLocaleString('default', { month: 'short', year: 'numeric' });

    let filteredItems: ReportChartItem[] = [];

    if (this.halfYearFilter === 'ALL') {
      filteredItems = sortedMonths.map(({ date, value, invoiceCount }) => ({
        name: formatLabel(date),
        value,
        invoiceCount,
      }));
    } else if (this.halfYearFilter === 'FIRST_QUARTER') {
      const firstThree = sortedMonths.slice(0, 3);
      filteredItems = firstThree.map(({ date, value, invoiceCount }) => ({
        name: formatLabel(date),
        value,
        invoiceCount,
      }));
    } else if (this.halfYearFilter === 'SECOND_QUARTER') {
      const lastThree = sortedMonths.slice(-3);
      filteredItems = lastThree.map(({ date, value, invoiceCount }) => ({
        name: formatLabel(date),
        value,
        invoiceCount,
      }));
    }

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

  onFilterChange(event: any): void {
    this.halfYearFilter = event.value;
    this.applyHalfYearFilter();
  }
}
