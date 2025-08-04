import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ReportItem } from '../../../../model/reports/report-item.model';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../../../shared-component/loading/loading.component';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-trend-chart',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective,
    LoadingComponent,
    MatCardModule,
    MatIconModule,
  ],
  providers: [provideCharts(withDefaultRegisterables())],
  templateUrl: './trend-chart.component.html',
  styleUrl: './trend-chart.component.css',
})
export class TrendChartComponent implements OnDestroy, OnChanges {
  @Input() importingData: ReportItem[] = [];
  @Input() sellingData: ReportItem[] = [];

  isLoading: boolean = true;

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [],
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: $${Number(
              context.raw
            ).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: 'Date' },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Amount (USD)' },
      },
    },
  };

  public lineChartLegend = true;
  public lineChartType: 'line' = 'line';

  ngOnChanges(changes: SimpleChanges): void {
    console.log('TrendChart ngOnChanges triggered:', changes);
    console.log('Importing data:', this.importingData);
    console.log('Selling data:', this.sellingData);
    if (changes['importingData'] || changes['sellingData']) {
      this._buildChart();
    }
  }

  ngOnDestroy(): void {}

  private _buildChart(): void {
    if (!this.importingData.length && !this.sellingData.length) return;

    const allDates = this._collectSortedUniqueDates();
    const importMap = this._mapDataToDateValue(this.importingData);
    const sellingMap = this._mapDataToDateValue(this.sellingData);

    const importValues = allDates.map((date) => importMap.get(date) || 0);
    const sellingValues = allDates.map((date) => sellingMap.get(date) || 0);

    this.lineChartData = {
      labels: allDates,
      datasets: [
        {
          data: importValues,
          label: 'Importing',
          borderColor: '#3182ce',
          backgroundColor: 'rgba(49, 130, 206, 0.3)',
          fill: false,
          tension: 0.3,
        },
        {
          data: sellingValues,
          label: 'Selling',
          borderColor: '#38a169',
          backgroundColor: 'rgba(56, 161, 105, 0.3)',
          fill: false,
          tension: 0.3,
        },
      ],
    };

    this.isLoading = false;
  }

  private _extractDateKey(date: Date | string | any): string {
    // Add validation for date
    if (!date) {
      console.warn('Invalid date provided:', date);
      return '';
    }

    let dateObj: Date;

    try {
      // Handle different date formats
      if (date instanceof Date) {
        dateObj = date;
      } else if (typeof date === 'string') {
        dateObj = new Date(date);
      } else if (typeof date === 'object' && date.toString) {
        // Handle case where date might be an object with toString method
        dateObj = new Date(date.toString());
      } else {
        console.warn('Unsupported date format:', typeof date, date);
        return '';
      }

      // Check if the date is valid
      if (isNaN(dateObj.getTime())) {
        console.warn('Invalid date format:', date);
        return '';
      }

      return dateObj.toISOString().split('T')[0]; // 'YYYY-MM-DD'
    } catch (error) {
      console.error('Error parsing date:', date, error);
      return '';
    }
  }

  private _mapDataToDateValue(data: ReportItem[]): Map<string, number> {
    return new Map(
      data.map((item) => [
        this._extractDateKey(item.date),
        parseFloat(item.value),
      ])
    );
  }

  private _collectSortedUniqueDates(): string[] {
    const dateSet = new Set<string>();
    this.importingData.forEach((item) =>
      dateSet.add(this._extractDateKey(item.date))
    );
    this.sellingData.forEach((item) =>
      dateSet.add(this._extractDateKey(item.date))
    );
    return Array.from(dateSet).sort(); // ISO format => lexicographical sort OK
  }
}
