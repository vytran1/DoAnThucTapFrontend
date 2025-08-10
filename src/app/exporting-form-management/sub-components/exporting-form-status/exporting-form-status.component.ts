import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { LoadingComponent } from '../../../shared-component/loading/loading.component';
import { ExportingFormService } from '../../../services/exporting-form.service';
import { Subscription } from 'rxjs';
import { ExportingFormStatus } from '../../../model/exporting-form/exporting-form-status.model';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-exporting-form-status',
  standalone: true,
  imports: [LoadingComponent, CommonModule, MatCardModule, MatIconModule],
  templateUrl: './exporting-form-status.component.html',
  styleUrl: './exporting-form-status.component.css',
})
export class ExportingFormStatusComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  statuses: ExportingFormStatus[] = [];

  @Input()
  formId!: number;

  isLoading = true;

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
}
