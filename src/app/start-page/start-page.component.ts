import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { WarningModalComponent } from '../shared-component/warning-modal/warning-modal.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { AccountService } from '../services/account.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-start-page',
  standalone: true,
  imports: [RouterModule, WarningModalComponent, CommonModule],
  templateUrl: './start-page.component.html',
  styleUrl: './start-page.component.css',
})
export class StartPageComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  title: string = 'LOGOUT';
  message: string = 'Do You Want To Logout From System ?';
  is_open_modal: boolean = false;
  imageUrl: string = '';
  id: any;
  isAnalysisOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.id = this.authService.getId();

    this.subscriptions.push(
      this.accountService.getImage().subscribe({
        next: (res) => {
          const fileName = res.body;
          console.log(fileName);

          this.imageUrl = `http://localhost:8080/employee-images/${this.id}/${fileName}`;
        },
      })
    );

    this.subscriptions.push(
      this.accountService.image$.subscribe((newFileName) => {
        if (newFileName) {
          this.imageUrl = `http://localhost:8080/employee-images/${this.id}/${newFileName}`;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

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
