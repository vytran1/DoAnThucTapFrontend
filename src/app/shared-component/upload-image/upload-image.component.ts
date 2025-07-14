import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-upload-image',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './upload-image.component.html',
  styleUrl: './upload-image.component.css',
})
export class UploadImageComponent {
  @Output() imageUploaded = new EventEmitter<File>();
  @Output() closed = new EventEmitter<void>();

  @Input()
  isChangeMainImage: boolean = false;

  selectedFile: File | null = null;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  submit() {
    if (this.selectedFile) {
      this.imageUploaded.emit(this.selectedFile);
    }
  }

  cancel() {
    this.closed.emit();
  }
}
