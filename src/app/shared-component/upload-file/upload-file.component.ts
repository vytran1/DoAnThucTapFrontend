import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-upload-file',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './upload-file.component.html',
  styleUrl: './upload-file.component.css',
})
export class UploadFileComponent {
  @Input() acceptType: string = '*/*'; // ví dụ: .xlsx,.xls,.csv hoặc image/*
  @Output() fileUploaded = new EventEmitter<File>();
  @Output() closed = new EventEmitter<void>();

  selectedFile: File | null = null;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  submit() {
    if (this.selectedFile) {
      this.fileUploaded.emit(this.selectedFile);
    }
  }

  cancel() {
    this.closed.emit();
  }
}
