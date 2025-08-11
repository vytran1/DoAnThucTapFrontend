import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LoadingComponent } from '../../../shared-component/loading/loading.component';
import { Subscription } from 'rxjs';
import { ExportingFormService } from '../../../services/exporting-form.service';
import { ExportingFormQuoteInformationAggregator } from '../../../model/exporting-form/exporting-form-quote-information-aggregator.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MessageModalComponent } from '../../../shared-component/message-modal/message-modal.component';

@Component({
  selector: 'app-exporting-form-quote-information',
  standalone: true,
  imports: [
    LoadingComponent,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MessageModalComponent,
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

  isOpenMessageModal = false;
  title = '';
  message = '';

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

  onAcceptShippingPrice() {
    this.subscriptions.push(
      this.exportingFormServie.updateAcceptPrice(this.formId).subscribe({
        next: (response) => {
          this.title = 'RESULT';
          this.message = 'Accept Price Successfully';
          this.isOpenMessageModal = true;
        },
        error: (err) => {
          this.title = 'ERROR';
          this.message = err.error;
          this.isOpenMessageModal = true;
        },
      })
    );
  }

  closeMessageModal() {
    this.isOpenMessageModal = false;
  }

  onRejectShippingPrice() {
    this.subscriptions.push(
      this.exportingFormServie.updateRejectPrice(this.formId).subscribe({
        next: (response) => {
          this.title = 'RESULT';
          this.message = 'Reject Price Successfully';
          this.isOpenMessageModal = true;
        },
        error: (err) => {
          this.title = 'ERROR';
          this.message = err.error;
          this.isOpenMessageModal = true;
        },
      })
    );
  }
}
