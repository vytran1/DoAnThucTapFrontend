import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingComponent } from '../../../shared-component/loading/loading.component';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { ExportingFormManagementComponent } from '../../exporting-form-management.component';
import { ExportingFormOverviewComponent } from '../exporting-form-overview/exporting-form-overview.component';
import { ExportingFormStatusComponent } from '../exporting-form-status/exporting-form-status.component';
import { ExportingFormQuoteInformationComponent } from '../exporting-form-quote-information/exporting-form-quote-information.component';

@Component({
  selector: 'app-exporting-form-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    ExportingFormOverviewComponent,
    ExportingFormStatusComponent,
    ExportingFormQuoteInformationComponent,
  ],
  templateUrl: './exporting-form-detail.component.html',
  styleUrl: './exporting-form-detail.component.css',
})
export class ExportingFormDetailComponent implements OnInit, OnDestroy {
  formId!: number;
  isLoading = true;
  tabs = [
    { label: 'Overview' },
    { label: 'Status' },
    { label: 'Quote Information' },
  ];
  selectedIndex = 0;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.formId = Number(this.route.snapshot.paramMap.get('formId'));

    console.log('Form Id', this.formId);
  }

  ngOnDestroy(): void {}
}
