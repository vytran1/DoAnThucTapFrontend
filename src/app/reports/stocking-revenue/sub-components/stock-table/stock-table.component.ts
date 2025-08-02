import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ReportStockItem } from '../../../../model/reports/report-stock-item.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stock-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    MatIconModule,
    FormsModule,
  ],
  templateUrl: './stock-table.component.html',
  styleUrl: './stock-table.component.css',
})
export class StockTableComponent implements OnChanges {
  @Input() data: ReportStockItem[] = [];
  @Input() totalValues: number = 0;
  lowStockThreshold: number = 5;
  displayedColumns: string[] = [
    'name',
    'sku',
    'quantity',
    'values',
    'lowStock',
  ];
  dataSource = new MatTableDataSource<ReportStockItem>([]);
  filterOption: 'ALL' | 'LOW' | 'NORMAL' = 'ALL';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.refreshData();
    }
  }

  onThresholdChange(): void {
    this.refreshData();
  }

  onFilterChange(value: 'ALL' | 'LOW' | 'NORMAL') {
    this.filterOption = value;
    this.refreshData();
  }

  private refreshData(): void {
    const updated = this.data.map((item) => {
      const isLow = item.quantity < this.lowStockThreshold;
      return {
        ...item,
        lowStock: isLow,
        low_stock: isLow,
      };
    });

    const filtered = updated.filter((item) => {
      if (this.filterOption === 'LOW') return item.lowStock;
      if (this.filterOption === 'NORMAL') return !item.lowStock;
      return true;
    });

    this.dataSource.data = filtered;
  }

  getRowClass(row: ReportStockItem): string {
    return row.low_stock ? 'low-stock-row' : 'normal-stock-row';
  }
}
