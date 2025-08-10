import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LoadingComponent } from '../../../shared-component/loading/loading.component';
import { ExportingFormService } from '../../../services/exporting-form.service';
import { Subscription } from 'rxjs';
import { ExportingFormOverview } from '../../../model/exporting-form/exporting-form-overview.model';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { MessageModalComponent } from '../../../shared-component/message-modal/message-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exporting-form-overview',
  standalone: true,
  imports: [
    LoadingComponent,
    MatCardModule,
    MatTableModule,
    MatDividerModule,
    CommonModule,
    MessageModalComponent,
  ],
  templateUrl: './exporting-form-overview.component.html',
  styleUrl: './exporting-form-overview.component.css',
})
export class ExportingFormOverviewComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  isLoading = true;
  exportingForm!: ExportingFormOverview;

  title = '';
  message = '';
  isOpenMessageModal = false;

  @Input()
  formId!: number;

  displayedColumns: string[] = ['sku', 'quantity'];

  constructor(
    private exportingFormService: ExportingFormService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.formId) {
      this.subscriptions.push(
        this.exportingFormService
          .getExportingFormOverview(this.formId)
          .subscribe({
            next: (response) => {
              this.exportingForm = response.body;
              this.isLoading = false;
              console.log('Exporting Form', this.exportingForm);
            },
            error: (err) => {
              (this.title = 'Error'), (this.message = err.error);
              this.isOpenMessageModal = true;
            },
            complete: () => {
              this.isLoading = false;
            },
          })
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  closeMessageModal() {
    this.isOpenMessageModal = false;
    this.router.navigateByUrl('/inventory/exporting-form-management');
  }
}
