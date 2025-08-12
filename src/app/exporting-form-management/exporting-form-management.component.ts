import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ImportingFormPage } from '../model/importing-form/importing-form.page.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { dateRangeValidator } from '../validators/sync-validator/date-range.validator';
import { CommonModule } from '@angular/common';
import { PageNumComponent } from '../shared-component/page-num/page-num.component';
import { Subscription } from 'rxjs';
import { ExportingFormPage } from '../model/exporting-form/exporting-form-page.model';
import { ExportingFormService } from '../services/exporting-form.service';

@Component({
  selector: 'app-exporting-form-management',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    ReactiveFormsModule,
    CommonModule,
    PageNumComponent,
    RouterModule,
  ],
  templateUrl: './exporting-form-management.component.html',
  styleUrl: './exporting-form-management.component.css',
})
export class ExportingFormManagementComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  exportingForms: ExportingFormPage[] = [];
  form!: FormGroup;

  pageNum = 1;
  pageSize = 10;
  sortField = 'id';
  sortDir = 'asc';
  totalPage = 0;
  totalItems = 0;

  constructor(
    private router: Router,
    private exportingFormService: ExportingFormService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group(
      {
        startDate: [null],
        endDate: [null],
      },
      { validators: [dateRangeValidator()] }
    );
  }

  redirectoExportingFormCreatePage() {
    this.router.navigateByUrl('/inventory/create-exporting-form');
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.exportingFormService.searchTrigger$.subscribe((res) => {
        console.log(res);

        this.exportingForms = res.body.forms;

        console.log(this.exportingForms);

        this.pageNum = res.body.page.pageNum;
        this.pageSize = res.body.page.pageSize;
        this.sortDir = res.body.page.sortDir;
        this.sortField = res.body.page.sortField;
        this.totalPage = res.body.page.totalPages;
        this.totalItems = res.body.page.totalItems;
      })
    );
  }

  applyFilter() {
    if (this.form.invalid) {
      return;
    }

    const startDate = this.form.get('startDate')?.value;
    const endDate = this.form.get('endDate')?.value;

    const start = startDate ? startDate.toISOString() : null;
    const end = endDate ? endDate.toISOString() : null;

    console.log(start);
    console.log(end);

    this.exportingFormService.setDate(start, end);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  onPageChange(page: number) {
    this.exportingFormService.onPageChange(page);
  }
}
