import { Component, OnDestroy, OnInit } from '@angular/core';
import { TransporterDropDownListComponent } from '../../../shared-component/transporter-drop-down-list/transporter-drop-down-list.component';
import { CommonModule } from '@angular/common';
import { InventoryDropDownListComponent } from '../../../shared-component/inventory-drop-down-list/inventory-drop-down-list.component';
import { MatButtonModule } from '@angular/material/button';
import { SearchVariantTableComponent } from '../../../shared-component/search-variant-table/search-variant-table.component';
import { ProductVariantWithStock } from '../../../model/product/product-variant-with-stock.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ExportingFormAggregator } from '../../../model/exporting-form/exporting-form-aggregator.model';
import { ExportingFormService } from '../../../services/exporting-form.service';
import { MessageModalComponent } from '../../../shared-component/message-modal/message-modal.component';
import { WarningModalComponent } from '../../../shared-component/warning-modal/warning-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-exporting-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TransporterDropDownListComponent,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    InventoryDropDownListComponent,
    MatButtonModule,
    SearchVariantTableComponent,
    MessageModalComponent,
    WarningModalComponent,
  ],
  templateUrl: './create-exporting-form.component.html',
  styleUrl: './create-exporting-form.component.css',
})
export class CreateExportingFormComponent implements OnInit, OnDestroy {
  selectedTransporterId: number | null = null;
  selectedInventoryId: number | null = null;
  isOpenSearchProductTable = false;
  title = '';
  message = '';
  isOpenMessageModal = false;

  isOpenWarningModal = false;
  isSuccess = false;

  form: any = null;

  constructor(
    private fb: FormBuilder,
    private exportingFormService: ExportingFormService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      details: this.fb.array([], Validators.required),
    });
  }

  ngOnDestroy(): void {}

  get detailArray(): FormArray {
    return this.form.get('details') as FormArray;
  }

  removeDetail(index: number) {
    this.detailArray.removeAt(index);
  }

  onTransporterSelected(id: number | null): void {
    this.selectedTransporterId = id;
  }

  onInventorySelected(id: number | null) {
    this.selectedInventoryId = id;
  }

  onAllInventorySelected(id: number | null) {
    this.selectedInventoryId = id;
  }

  openSearchProductTable() {
    this.isOpenSearchProductTable = true;
  }

  closeSearchProductTable() {
    this.isOpenSearchProductTable = false;
  }

  onProductAdded(product: any) {
    const alreadyExists = this.detailArray.controls.some(
      (ctrl) => ctrl.get('sku')?.value === product.sku
    );
    if (alreadyExists) return;

    const detailGroup = this.fb.group({
      sku: [product.sku],
      name: [product.name],
      quantity: [
        1,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(product.current_quantity),
        ],
      ],
      maxQuantity: [product.current_quantity],
    });

    this.detailArray.push(detailGroup);
  }

  onSubmit(): void {
    this.onCloseWarningModal();
    if (
      this.selectedInventoryId != null &&
      this.selectedTransporterId != null
    ) {
      const payload: ExportingFormAggregator = {
        transporter: this.selectedTransporterId,
        inventory: this.selectedInventoryId,
        details: this.detailArray.getRawValue(),
      };
      console.log('✅ Submit payload:', payload);

      this.exportingFormService.saveExportingForm(payload).subscribe({
        next: (response) => {
          console.log(response);
          this.title = 'RESULT';
          this.message = 'Successfully Create New Exporting Form';
          this.isOpenMessageModal = true;
        },
        error: (err) => {
          console.log(err);
          this.title = 'ERROR';
          this.message = err.error;
          this.isOpenMessageModal = true;
        },
        complete: () => {
          console.log('Finish');
        },
      });
    }
  }

  openWarningModal() {
    this.title = 'WARNING';
    this.message = 'Do You Really Want To Execute This Action ?';
    this.isOpenWarningModal = true;
    console.log('Open Warning Modal');
  }

  clearMessageAndTitle() {
    this.title = '';
    this.message = '';
  }

  onCloseMessageModal() {
    this.clearMessageAndTitle();
    this.isOpenMessageModal = false;
  }

  onCloseWarningModal() {
    this.clearMessageAndTitle();
    this.isOpenWarningModal = false;
  }
}
