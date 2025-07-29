import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReportService } from '../../../../services/report.service';
import { ReportRequest } from '../../../../model/reports/report-request.model';
import { AuthService } from '../../../../services/auth.service';
import { LoadingComponent } from '../../../../shared-component/loading/loading.component';
import { CommonModule } from '@angular/common';
import { ReportItem } from '../../../../model/reports/report-item.model';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { Color } from '@swimlane/ngx-charts';
import { ReportChartItem } from '../../../../model/reports/report-chart-item.model';

@Component({
  selector: 'app-report-by-week',
  standalone: true,
  imports: [LoadingComponent, CommonModule, NgxChartsModule],
  templateUrl: './report-by-week.component.html',
  styleUrl: './report-by-week.component.css',
})
export class ReportByWeekComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  reportRequest: ReportRequest = {
    type: 'WEEK',
  };

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
    if (this.authService.isSuperAdmin()) {
      this.fetchAdminData();
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

  fetchAdminData(): void {
    this.loading = true;
    this.reportRequest.inventory_id = null; // 👈 để backend hiểu là lấy toàn bộ

    const sub = this.reportService
      .fetchRevenueReportDataForAdmin(this.reportRequest)
      .subscribe({
        next: (res) => {
          console.log(res);

          this.report_items = res.body.items.map((item: ReportItem) => ({
            name: new Date(item.date).toLocaleDateString(), // hoặc format lại tùy ý
            value: parseFloat(item.value),
          }));
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
}
