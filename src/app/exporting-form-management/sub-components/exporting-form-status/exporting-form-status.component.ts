import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LoadingComponent } from '../../../shared-component/loading/loading.component';
import { ExportingFormService } from '../../../services/exporting-form.service';
import { Subscription } from 'rxjs';
import { ExportingFormStatus } from '../../../model/exporting-form/exporting-form-status.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { StatusListComponent } from '../../../shared-component/status-list/status-list.component';
import { MessageModalComponent } from '../../../shared-component/message-modal/message-modal.component';

@Component({
  selector: 'app-exporting-form-status',
  standalone: true,
  imports: [
    LoadingComponent,
    CommonModule,
    MatCardModule,
    MatIconModule,
    StatusListComponent,
    MessageModalComponent,
  ],
  templateUrl: './exporting-form-status.component.html',
  styleUrl: './exporting-form-status.component.css',
})
export class ExportingFormStatusComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  statuses: ExportingFormStatus[] = [];

  @Input()
  formId!: number;

  isLoading = true;

  statusOptions = ['PAYING', 'GIVING_PRODUCT', 'FINISH'];

  isOpenListStatus = false;
  isOpenMessageModal = false;
  title = '';
  message = '';

  onStatusSelected(status: string) {
    console.log('Selected Status:', status);
    switch (status) {
      case 'PAYING':
        this.updatePayingStatus();
        break;
      case 'GIVING_PRODUCT':
        this.updateGivingProductStatus();
        this.isOpenListStatus = false;
        break;
      case 'FINISH':
        this.updateFinishStatus();
        break;
      default:
        break;
    }
  }

  onCancelled() {
    console.log('Cancel Operation');
    this.isOpenListStatus = false;
  }

  updatePayingStatus() {
    this.subscriptions.push(
      this.exportingFormService.updatePayingStatus(this.formId).subscribe({
        next: (response) => {
          this.statuses.push(response.body);
          this.isOpenListStatus = false;
          this.title = 'RESULT';
          this.message = 'Update Status Paying successfully';
          this.isOpenMessageModal = true;
        },
        error: (err) => {
          this.isOpenListStatus = false;
          this.title = 'ERROR';
          this.message = err.error;
          this.isOpenMessageModal = true;
        },
      })
    );
  }

  updateGivingProductStatus() {
    this.subscriptions.push(
      this.exportingFormService.updateGivingProduct(this.formId).subscribe({
        next: (response) => {
          this.statuses.push(response.body);
          this.isOpenListStatus = false;
          this.title = 'RESULT';
          this.message = 'Update Status Giving Product successfully';
          this.isOpenMessageModal = true;
        },
        error: (err) => {
          this.isOpenListStatus = false;
          this.title = 'ERROR';
          this.message = err.error;
          this.isOpenMessageModal = true;
        },
      })
    );
  }

  updateFinishStatus() {
    this.subscriptions.push(
      this.exportingFormService.updateFinishStatus(this.formId).subscribe({
        next: (response) => {
          this.statuses.push(response.body);
          this.isOpenListStatus = false;
          this.title = 'RESULT';
          this.message = 'Update Status Finish successfully';
          this.isOpenMessageModal = true;
        },
        error: (err) => {
          this.isOpenListStatus = false;
          this.title = 'ERROR';
          this.message = err.error;
          this.isOpenMessageModal = true;
        },
      })
    );
  }

  constructor(private exportingFormService: ExportingFormService) {}

  ngOnInit(): void {
    if (this.formId) {
      this.subscriptions.push(
        this.exportingFormService
          .getExportingFormStatus(this.formId)
          .subscribe({
            next: (response) => {
              this.statuses = response.body;
              this.isLoading = false;
              console.log('Status', this.statuses);
            },
          })
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  openListStatus() {
    this.isOpenListStatus = true;
  }

  closeMessageModal() {
    this.isOpenMessageModal = false;
  }
}
