import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { WarningModalComponent } from '../shared-component/warning-modal/warning-modal.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-start-page',
  standalone: true,
  imports: [RouterModule, WarningModalComponent, CommonModule],
  templateUrl: './start-page.component.html',
  styleUrl: './start-page.component.css',
})
export class StartPageComponent {
  title: string = 'LOGOUT';
  message: string = 'Do You Want To Logout From System ?';
  is_open_modal: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onLogoutClick() {
    this.is_open_modal = true;
  }

  onConfirm() {
    console.log('LOGOUT');
    this.authService.logout();
    this.router.navigateByUrl('/login');
    this.is_open_modal = false;
  }

  onCancel() {
    console.log('CANCEL');
    this.is_open_modal = false;
  }
}
