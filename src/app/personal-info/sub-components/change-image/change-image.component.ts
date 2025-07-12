import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AccountService } from '../../../services/account.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-change-image',
  standalone: true,
  imports: [MatButtonModule, CommonModule],
  templateUrl: './change-image.component.html',
  styleUrl: './change-image.component.css',
})
export class ChangeImageComponent {
  imagePreview: string | null = null;
  selectedFile: File | null = null;

  constructor(private accountService: AccountService) {}

  onFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onClick() {
    if (!this.selectedFile) return;

    this.accountService.changeImage(this.selectedFile).subscribe({
      next: (res) => {
        console.log('Cập nhật ảnh thành công');
        console.log(res);

        // Có thể hiện thông báo hoặc phát lại ảnh qua image$
      },
      error: (err) => {
        console.error('Lỗi upload ảnh:', err);
      },
    });
  }
}
