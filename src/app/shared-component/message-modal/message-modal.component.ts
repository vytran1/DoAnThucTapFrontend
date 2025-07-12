import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-message-modal',
  standalone: true,
  imports: [],
  templateUrl: './message-modal.component.html',
  styleUrl: './message-modal.component.css',
})
export class MessageModalComponent {
  @Input() title: string = 'Notification';
  @Input() message: string = '';
  @Output() closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
  }
}
