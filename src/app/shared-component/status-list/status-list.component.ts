import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input'; // tùy nếu bạn dùng input trong tương lai
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-status-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './status-list.component.html',
  styleUrl: './status-list.component.css',
})
export class StatusListComponent {
  @Input() statusList: string[] = [];
  @Output() statusSelected = new EventEmitter<string>();
  @Output() cancelled = new EventEmitter<void>();

  selectedStatus: string = '';

  submit() {
    if (this.selectedStatus) {
      this.statusSelected.emit(this.selectedStatus);
    }
  }

  cancel() {
    this.cancelled.emit();
  }
}
