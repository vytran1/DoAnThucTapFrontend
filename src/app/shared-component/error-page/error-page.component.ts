import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-error-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './error-page.component.html',
  styleUrl: './error-page.component.css',
})
export class ErrorPageComponent {
  @Input() title?: string;
  @Input() message?: string;
  @Input() backLabel?: string;
  @Input() backLink?: string;

  gifUrl = 'https://media.giphy.com/media/UoeaPqYrimha6rdTFV/giphy.gif';

  constructor(private router: Router) {}

  navigateBack() {
    this.router.navigateByUrl(this.backLink || '/');
  }
}
