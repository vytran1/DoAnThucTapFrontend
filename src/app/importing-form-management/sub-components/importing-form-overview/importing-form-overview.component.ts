import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ImportingFormService } from '../../../services/importing-form.service';
import { ImportingFormDetailOverview } from '../../../model/importing-form/importing-form-detail-overview.model';
import { ImportingFormOverview } from '../../../model/importing-form/importing-form-overview.model';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from '../../../shared-component/loading/loading.component';
import { MessageModalComponent } from '../../../shared-component/message-modal/message-modal.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-importing-form-overview',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    LoadingComponent,
    MessageModalComponent,
  ],
  templateUrl: './importing-form-overview.component.html',
  styleUrl: './importing-form-overview.component.css',
})
export class ImportingFormOverviewComponent implements OnInit, OnDestroy {
  @Input()
  formId!: number;
  isLoading = true;
  isOpenMessageModal = false;
  title = '';
  message = '';

  subscriptions: Subscription[] = [];
  displayedColumns: string[] = ['sku', 'quantity', 'costPrice', 'totalValues'];

  form!: ImportingFormOverview;

  constructor(
    private importingFormService: ImportingFormService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.formId) {
      this.importingFormService.getOverview(this.formId).subscribe({
        next: (response) => {
          this.title = '';
          this.message = '';
          this.isOpenMessageModal = false;
          this.isLoading = false;
          console.log(response);
          this.form = response.body;
        },
        error: (err) => {
          console.log(err);
          this.title = 'ERROR';
          this.message = err.error;
          this.isOpenMessageModal = true;
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  onCloseMessageModal() {
    this.title = '';
    this.message = '';
    this.isOpenMessageModal = false;
    this.router.navigateByUrl('/inventory/importing-form-management');
  }
}
