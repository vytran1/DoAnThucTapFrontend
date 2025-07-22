import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-warning-modal',
  standalone: true,
  imports: [],
  templateUrl: './warning-modal.component.html',
  styleUrl: './warning-modal.component.css',
})
export class WarningModalComponent {
  @Input() visible: boolean = false;
  @Input() title: string = 'Warning';
  @Input() message: string = 'Are you sure you want to perform this action?';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
