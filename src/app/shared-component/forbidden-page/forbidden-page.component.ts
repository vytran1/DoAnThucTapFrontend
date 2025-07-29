import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-forbidden-page',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './forbidden-page.component.html',
  styleUrl: './forbidden-page.component.css',
})
export class ForbiddenPageComponent {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/inventory']);
  }
}
