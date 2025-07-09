import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthRequest } from '../model/security/auth-request.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: any;
  subscriptions: Subscription[] = [];
  isProcessing: boolean = false;
  failMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this.authService.isLogged()) {
      this.router.navigateByUrl('/inventory');
    } else {
      this.router.navigateByUrl('/login');
    }

    this.loginForm = this.formBuilder.group({
      username: [
        '',
        {
          validators: [Validators.required, Validators.email],
        },
      ],
      password: [
        '',
        {
          validators: [Validators.required, Validators.minLength(5)],
        },
      ],
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  onSubmit() {
    const value: AuthRequest = this.loginForm.value;
    this.failMessage = '';
    this.isProcessing = true;
    this.subscriptions.push(
      this.authService.login(value).subscribe({
        next: (response) => {
          console.log(response);

          const token = response.body.accessToken;

          this.authService.saveToken(token);
          this.router.navigateByUrl('/inventory');
        },
        error: (err) => {
          console.log(err);
          this.failMessage = 'Your account is not exist or password is wrong';
          this.isProcessing = false;
        },
        complete: () => {
          this.isProcessing = false;
        },
      })
    );
  }
}
