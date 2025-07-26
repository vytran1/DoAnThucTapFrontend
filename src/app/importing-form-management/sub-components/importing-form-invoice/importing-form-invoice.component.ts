import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ImportingFormService } from '../../../services/importing-form.service';
import { Subscription } from 'rxjs';
import { QuoteData } from '../../../model/inventory-order/quote-data.model';
import { LoadingComponent } from '../../../shared-component/loading/loading.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { QuoteView } from '../../../model/inventory-order/quote-view.model';
@Component({
  selector: 'app-importing-form-invoice',
  standalone: true,
  imports: [
    LoadingComponent,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    CommonModule,
  ],
  templateUrl: './importing-form-invoice.component.html',
  styleUrl: './importing-form-invoice.component.css',
})
export class ImportingFormInvoiceComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  @Input()
  formId!: number;

  isLoading = true;

  invoice_info: QuoteData | null = null;

  invoiceItemDisplayedColumns = [
    'sku',
    'product_name',
    'quoted_price',
    'quantity',
  ];

  constructor(private importingFormService: ImportingFormService) {}

  ngOnInit(): void {
    if (this.formId) {
      this.subscriptions.push(
        this.importingFormService.getInvoiceInformation(this.formId).subscribe({
          next: (resposne) => {
            this.isLoading = false;
            console.log(resposne);
            this.invoice_info = resposne.body;
          },
          error: (err) => {
            console.log(err);
          },
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
