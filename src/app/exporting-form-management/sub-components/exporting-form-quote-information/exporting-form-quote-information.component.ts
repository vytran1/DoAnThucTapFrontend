import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LoadingComponent } from '../../../shared-component/loading/loading.component';
import { Subscription } from 'rxjs';
import { ExportingFormService } from '../../../services/exporting-form.service';
import { ExportingFormQuoteInformationAggregator } from '../../../model/exporting-form/exporting-form-quote-information-aggregator.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exporting-form-quote-information',
  standalone: true,
  imports: [
    LoadingComponent,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './exporting-form-quote-information.component.html',
  styleUrl: './exporting-form-quote-information.component.css',
})
export class ExportingFormQuoteInformationComponent
  implements OnInit, OnDestroy
{
  subscriptions: Subscription[] = [];
  quotePriceInformation!: ExportingFormQuoteInformationAggregator;
  isLoading = true;

  @Input()
  formId!: number;

  constructor(private exportingFormServie: ExportingFormService) {}

  ngOnInit(): void {
    if (this.formId) {
      this.subscriptions.push(
        this.exportingFormServie
          .getExportingFormQuotePrice(this.formId)
          .subscribe({
            next: (response) => {
              this.quotePriceInformation = response.body;
              this.isLoading = false;
              console.log('Quote Price Data', this.quotePriceInformation);
            },
          })
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  onAcceptShippingPrice() {}

  onRejectShippingPrice() {}
}
