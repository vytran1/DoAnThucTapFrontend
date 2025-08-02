import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { InventorySearchModel } from '../../model/inventory/inventory-search.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InventoryService } from '../../services/inventory.service';
import { Subscription } from 'rxjs';
import { VinventoryService } from '../../services/vinventory.service';

@Component({
  selector: 'app-inventory-drop-down-list',
  standalone: true,
  imports: [MatSelectModule, MatFormFieldModule, FormsModule, CommonModule],
  templateUrl: './inventory-drop-down-list.component.html',
  styleUrl: './inventory-drop-down-list.component.css',
})
export class InventoryDropDownListComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  inventoryList: InventorySearchModel[] = [];
  selectedInventoryId: number | null = null;

  @Output() inventoryChanged = new EventEmitter<number>();
  @Output() allInventory = new EventEmitter<number>();

  constructor(private inventoryService: VinventoryService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.inventoryService
        .getInventoriesDropDownList()
        .subscribe((response) => {
          this.inventoryList = response.body;
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  onSelectionChange(): void {
    if (this.selectedInventoryId !== null) {
      this.inventoryChanged.emit(this.selectedInventoryId);
    } else {
      this.allInventory.emit(0);
    }
  }
}
