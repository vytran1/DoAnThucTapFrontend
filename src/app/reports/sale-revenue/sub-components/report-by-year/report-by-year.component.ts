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
import { MatSelectChange } from '@angular/material/select';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

type YearFilterType =
  | 'ALL'
  | 'FIRST_HALF'
  | 'SECOND_HALF'
  | 'SPRING'
  | 'SUMMER'
  | 'AUTUMN'
  | 'WINTER';

@Component({
  selector: 'app-report-by-year',
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
  templateUrl: './report-by-year.component.html',
  styleUrl: './report-by-year.component.css',
})
export class ReportByYearComponent {
  yearFilter: YearFilterType = 'ALL';
  subscriptions: Subscription[] = [];
  reportRequest: ReportRequest = {
    type: 'YEAR', // Updated type for 'by year' report
  };

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

  private _fetchData(
    isSuperAdmin: boolean,
    inventoryId: number | null = null
  ): void {
    this.loading = true;
    this.reportRequest.inventory_id = inventoryId;

    const fetchMethod = isSuperAdmin
      ? this.reportService.fetchRevenueReportDataForAdmin(this.reportRequest)
      : this.reportService.fetchRevenueReportDataForDirector(
          this.reportRequest
        );

    const sub = fetchMethod.subscribe({
      next: (res) => {
        this.yearFilter = 'ALL';
        this.originalItems = res.body.items;
        this.total = res.body.total_values;
        this.reportData = res.body;
        this.loading = false;
        this._processAndDisplayData();
      },
      error: (err) => {
        console.log(err);
        this.error = 'Failed to fetch data';
        this.loading = false;
      },
    });

    this.subscriptions.push(sub);
  }

  fetchAdminData(id: number | null): void {
    this._fetchData(true, id);
  }

  fetchDirectorData(): void {
    this._fetchData(false);
  }

  private _processAndDisplayData(): void {
    const groupedData = this._groupItemsByMonth(this.originalItems);
    const sortedData = this._sortGroupedData(groupedData);
    const filteredData = this._filterGroupedItems(sortedData);
    this._updateChartData(filteredData);
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

    return Array.from(monthMap.entries()).map(
      ([key, { totalValue, itemCounts }]) => {
        const [year, month] = key.split('-').map(Number);
        return {
          name: new Date(year, month).toLocaleString('default', {
            month: 'short',
            year: 'numeric',
          }),
          value: totalValue,
          invoiceCount: itemCounts,
          month: month,
          year: year, // Now also storing the year as a number
        };
      }
    );
  }

  private _sortGroupedData(items: ReportChartItem[]): ReportChartItem[] {
    return items.sort((a, b) => {
      // Improved sorting: use the numeric year and month properties directly
      if (a.year !== b.year) {
        return (a.year || 0) - (b.year || 0);
      }
      return (a.month || 0) - (b.month || 0);
    });
  }

  private _filterGroupedItems(items: ReportChartItem[]): ReportChartItem[] {
    let filteredItems: ReportChartItem[] = items;

    switch (this.yearFilter) {
      case 'FIRST_HALF':
        filteredItems = filteredItems.filter((item, index) => index < 6);
        break;
      case 'SECOND_HALF':
        filteredItems = filteredItems.filter((item, index) => index >= 6);
        break;
      case 'SPRING':
        filteredItems = filteredItems.filter((item) =>
          [0, 1, 2].includes(item.month!)
        );
        break;
      case 'SUMMER':
        filteredItems = filteredItems.filter((item) =>
          [3, 4, 5].includes(item.month!)
        );
        break;
      case 'AUTUMN':
        filteredItems = filteredItems.filter((item) =>
          [6, 7, 8, 9].includes(item.month!)
        );
        break;
      case 'WINTER':
        filteredItems = filteredItems.filter((item) =>
          [10, 11].includes(item.month!)
        );
        break;
      case 'ALL':
      default:
        // Do nothing, all items are already included
        break;
    }
    return filteredItems;
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

  onFilterChange(event: MatSelectChange): void {
    this.yearFilter = event.value;
    this._processAndDisplayData();
  }
}
