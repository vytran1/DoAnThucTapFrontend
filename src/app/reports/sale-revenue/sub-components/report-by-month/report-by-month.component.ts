import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReportRequest } from '../../../../model/reports/report-request.model';
import { ReportChartItem } from '../../../../model/reports/report-chart-item.model';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { ReportService } from '../../../../services/report.service';
import { AuthService } from '../../../../services/auth.service';
import { ReportItem } from '../../../../model/reports/report-item.model';
import { LoadingComponent } from '../../../../shared-component/loading/loading.component';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { InventoryDropDownListComponent } from '../../../../shared-component/inventory-drop-down-list/inventory-drop-down-list.component';

type MonthFilterType =
  | 'ALL'
  | 'FIRST_HALF'
  | 'SECOND_HALF'
  | 'FOUR_WEEKS'
  | 'LAST_30_DAYS';
@Component({
  selector: 'app-report-by-month',
  standalone: true,
  imports: [
    LoadingComponent,
    CommonModule,
    NgxChartsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    InventoryDropDownListComponent,
  ],
  templateUrl: './report-by-month.component.html',
  styleUrl: './report-by-month.component.css',
})
export class ReportByMonthComponent implements OnInit, OnDestroy {
  monthFilter: MonthFilterType = 'ALL';
  subscriptions: Subscription[] = [];
  reportRequest: ReportRequest = {
    type: 'MONTH',
  };

  originalItems: ReportChartItem[] = [];
  isAdmin = false;

  reportData: any;
  report_items: ReportChartItem[] = [];
  total!: number;
  loading: boolean = false;
  error: string | null = null;

  colorScheme: Color = {
    name: 'greenScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#2f855a', '#38a169', '#68d391'],
  };

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
    this.reportRequest.inventory_id = id; // 👈 để backend hiểu là lấy toàn bộ

    const sub = this.reportService
      .fetchRevenueReportDataForAdmin(this.reportRequest)
      .subscribe({
        next: (res) => {
          this.monthFilter = 'ALL';
          console.log(res);

          this.report_items = res.body.items.map((item: ReportItem) => ({
            name: new Date(item.date).toLocaleDateString(),
            value: parseFloat(item.value),
          }));
          this.originalItems = [...this.report_items];
          this.total = res.body.total_values;
          console.log(this.report_items);

          this.reportData = res.body;
          this.loading = false;
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
          this.monthFilter = 'ALL'; // reset filter
          this.report_items = res.body.items.map((item: ReportItem) => ({
            name: new Date(item.date).toLocaleDateString(),
            value: parseFloat(item.value),
          }));
          this.originalItems = [...this.report_items];
          this.total = res.body.total_values;
          this.reportData = res.body;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to fetch director data';
          this.loading = false;
        },
      });

    this.subscriptions.push(sub);
  }

  private getWeekInMonth(date: Date): number {
    const day = date.getDate();
    return Math.ceil(day / 7);
  }

  applyMonthFilter(): void {
    if (this.monthFilter === 'FOUR_WEEKS') {
      const weeksMap = new Map<string, number>();

      this.originalItems.forEach((item) => {
        const date = new Date(item.name);
        const weekNumber = this.getWeekInMonth(date);
        const label = `Week ${weekNumber}`;

        const current = weeksMap.get(label) || 0;
        weeksMap.set(label, current + item.value);
      });

      this.report_items = Array.from(weeksMap.entries()).map(
        ([name, value]) => ({
          name,
          value,
        })
      );

      return;
    }

    const today = new Date();
    const thisMonth = today.getMonth();
    const thisYear = today.getFullYear();

    if (this.monthFilter === 'ALL') {
      this.report_items = [...this.originalItems];
      return;
    }

    this.report_items = this.originalItems.filter((item) => {
      const date = new Date(item.name);

      switch (this.monthFilter) {
        case 'FIRST_HALF':
          return date.getDate() >= 1 && date.getDate() <= 15;
        case 'SECOND_HALF':
          return date.getDate() >= 16;
        case 'LAST_30_DAYS':
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(today.getDate() - 30);
          return date >= thirtyDaysAgo && date <= today;
        default:
          return true;
      }
    });
  }
}
