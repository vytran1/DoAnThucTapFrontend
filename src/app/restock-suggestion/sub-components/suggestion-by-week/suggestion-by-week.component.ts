import { Component, OnDestroy, OnInit } from '@angular/core';
import { RestockSuggestion } from '../../../model/analysis/restock-suggestion.model';
import { AnalysisService } from '../../../services/analysis.service';
import { Subscription } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderDetailWithExpectedPrice } from '../../../model/inventory-order/order-detail-with-expected-price.model';
import { SettingService } from '../../../services/setting.service';

@Component({
  selector: 'app-suggestion-by-week',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
  ],
  templateUrl: './suggestion-by-week.component.html',
  styleUrl: './suggestion-by-week.component.css',
})
export class SuggestionByWeekComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  restockSuggestions: RestockSuggestion[] = [];
  filteredSuggestions: RestockSuggestion[] = [];

  startDate!: Date;
  endDate!: Date;

  columns: string[] = [
    'sku',
    'name',
    'total_current_stocking',
    'total_saled_quantity',
    'average_saled_quantity',
    'predict_quantity_for_next_period',
    'suggestion_quantity',
    'need_to_be_imported',
  ];

  filterMode: 'all' | 'need' | 'noNeed' = 'all';

  displayedColumns: string[] = [
    'sku',
    'name',
    'total_current_stocking',
    'total_saled_quantity',
    'average_saled_quantity',
    'predict_quantity_for_next_period',
    'need_to_be_imported',
  ];

  constructor(
    private analysisService: AnalysisService,
    private router: Router,
    private settingService: SettingService
  ) {
    this.subscriptions.push(
      this.analysisService.getRestockAnalysisByWeek().subscribe({
        next: (response) => {
          console.log(response);
          this.restockSuggestions = response.body.suggestions;
          this.filteredSuggestions = [...this.restockSuggestions];
          this.startDate = new Date(response.body.start_date);
          this.endDate = new Date(response.body.end_date);
        },
        error: (err) => {
          console.log(err);
        },
      })
    );
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  applyFilter() {
    if (this.filterMode === 'need') {
      this.filteredSuggestions = this.restockSuggestions.filter(
        (s) => s.need_to_be_imported
      );
    } else if (this.filterMode === 'noNeed') {
      this.filteredSuggestions = this.restockSuggestions.filter(
        (s) => !s.need_to_be_imported
      );
    } else {
      this.filteredSuggestions = [...this.restockSuggestions];
    }
  }

  getSuggestionQuantity(row: RestockSuggestion): number {
    return row.predict_quantity_for_next_period - row.total_current_stocking;
  }

  redirectToCreateOrder() {
    const threshold =
      Number(this.settingService.get('LOW_STOCK_THRESHOLD')) || 0;

    const productsToImport: OrderDetailWithExpectedPrice[] =
      this.restockSuggestions
        .filter((s) => s.need_to_be_imported)
        .map((s) => {
          const baseQty =
            s.predict_quantity_for_next_period - s.total_current_stocking;
          const quantity = baseQty + threshold;

          return {
            sku: s.sku,
            name: s.name,
            quantity,
            expected_price: 1000,
          };
        })
        .filter((item) => item.quantity > 0);

    this.router.navigate(['inventory/create-order'], {
      state: { suggestions: productsToImport },
    });
  }
}
