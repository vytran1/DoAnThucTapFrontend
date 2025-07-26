import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { ImportingFormInvoiceComponent } from '../importing-form-invoice/importing-form-invoice.component';
import { ImportingFormOverviewComponent } from '../importing-form-overview/importing-form-overview.component';

@Component({
  selector: 'app-importing-form-details-page',
  standalone: true,
  imports: [
    MatTabsModule,
    ImportingFormInvoiceComponent,
    ImportingFormOverviewComponent,
  ],
  templateUrl: './importing-form-details-page.component.html',
  styleUrl: './importing-form-details-page.component.css',
})
export class ImportingFormDetailsPageComponent {
  formId!: number;
  tabs = [{ label: 'Overview' }, { label: 'Invoice By Supplier' }];

  constructor(private activeRoute: ActivatedRoute) {}

  selectedIndex = 0;

  ngOnInit(): void {
    this.formId = Number(this.activeRoute.snapshot.paramMap.get('formId'));

    console.log(this.formId);
  }
}
