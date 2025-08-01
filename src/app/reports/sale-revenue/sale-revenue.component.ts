import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ReportByWeekComponent } from './sub-components/report-by-week/report-by-week.component';
import { ReportByMonthComponent } from './sub-components/report-by-month/report-by-month.component';
import { ReportByHalfYearComponent } from './sub-components/report-by-half-year/report-by-half-year.component';
import { ReportByYearComponent } from './sub-components/report-by-year/report-by-year.component';
import { ReportByCustomDateComponent } from './sub-components/report-by-custom-date/report-by-custom-date.component';
@Component({
  selector: 'app-sale-revenue',
  standalone: true,
  imports: [
    MatTabsModule,
    CommonModule,
    ReportByWeekComponent,
    ReportByMonthComponent,
    ReportByHalfYearComponent,
    ReportByYearComponent,
    ReportByCustomDateComponent,
  ],
  templateUrl: './sale-revenue.component.html',
  styleUrl: './sale-revenue.component.css',
})
export class SaleRevenueComponent {
  selectedTabIndex = 0;
}
