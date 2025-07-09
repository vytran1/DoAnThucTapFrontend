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
  @Input() title: string = 'Cảnh báo';
  @Input() message: string = 'Bạn có chắc chắn muốn thực hiện hành động này?';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
