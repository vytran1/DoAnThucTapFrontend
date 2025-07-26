import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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
import { Router, RouterModule } from '@angular/router';
import { ImportingFormService } from '../services/importing-form.service';

@Component({
  selector: 'app-importing-form-management',
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
  templateUrl: './importing-form-management.component.html',
  styleUrl: './importing-form-management.component.css',
})
export class ImportingFormManagementComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  importingForms: ImportingFormPage[] = [];
  form!: FormGroup;

  pageNum = 1;
  pageSize = 2;
  sortField = 'id';
  sortDir = 'asc';
  totalPage = 0;
  totalItems = 0;

  constructor(
    private importingFormService: ImportingFormService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group(
      {
        startDate: [null],
        endDate: [null],
      },
      { validators: [dateRangeValidator()] }
    );
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.importingFormService.searchTrigger$.subscribe((res) => {
        console.log(res);

        this.importingForms = res.body.forms;
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

    this.importingFormService.setDate(start, end);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  onPageChange(page: number) {
    this.importingFormService.onPageChange(page);
  }
}
