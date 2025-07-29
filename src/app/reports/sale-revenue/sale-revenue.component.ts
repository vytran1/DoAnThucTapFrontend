import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ReportByWeekComponent } from './sub-components/report-by-week/report-by-week.component';
@Component({
  selector: 'app-sale-revenue',
  standalone: true,
  imports: [MatTabsModule, CommonModule, ReportByWeekComponent],
  templateUrl: './sale-revenue.component.html',
  styleUrl: './sale-revenue.component.css',
})
export class SaleRevenueComponent {
  selectedTabIndex = 0;
}
