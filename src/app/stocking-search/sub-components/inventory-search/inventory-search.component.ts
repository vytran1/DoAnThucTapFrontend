import { CommonModule } from '@angular/common';
import { Component, NgModule, OnDestroy, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms'; // Cho [(ngModel)]
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MessageModalComponent } from '../../../shared-component/message-modal/message-modal.component';
import { InventorySearchModel } from '../../../model/inventory/inventory-search.model';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { StockingInventorySearchModel } from '../../../model/stocking/stocking-inventory-search.model';
import { product_images_path } from '../../../../environment/environement.config';
import { InventoryService } from '../../../services/inventory.service';
import { filter, Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
  of,
} from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { StockingService } from '../../../services/stocking.service';

@Component({
  selector: 'app-inventory-search',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MessageModalComponent,
    ReactiveFormsModule,
    MatAutocompleteModule,
  ],
  templateUrl: './inventory-search.component.html',
  styleUrl: './inventory-search.component.css',
})
export class InventorySearchComponent implements OnInit, OnDestroy {
  prefix = product_images_path;
  subscriptions: Subscription[] = [];
  searchControl = new FormControl('');
  filteredInventories: InventorySearchModel[] = [];
  inventoryCode: string = '';
  stockResults: StockingInventorySearchModel[] = [];
  isOpenMessageModal = false;
  message = '';
  title = '';

  displayedColumns: string[] = ['image', 'sku', 'quantity'];

  constructor(
    private inventoryService: InventoryService,
    private stockingService: StockingService
  ) {}

  ngOnInit(): void {
    const sub = this.searchControl.valueChanges
      .pipe(
        filter((value): value is string => value !== null),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value: string) => {
          if (!value || value.trim() === '') return of([]);
          return this.inventoryService
            .searchByName(value)
            .pipe(catchError(() => of([])));
        })
      )
      .subscribe((res: any) => {
        this.filteredInventories = res.body || [];
      });

    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  onSearch() {}

  closeModal() {
    this.isOpenMessageModal = false;
  }

  onSelect(event: MatAutocompleteSelectedEvent) {
    const selectedId = event.option.value;
    console.log('Selected inventory id:', selectedId);

    this.subscriptions.push(
      this.stockingService.getStockingOfInventory(selectedId).subscribe({
        next: (response) => {
          console.log('Response', response);

          this.stockResults = response.body;
        },
      })
    );
  }
}
