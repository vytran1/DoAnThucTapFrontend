import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMatchValidator } from '../../../validators/sync-validator/password-match.validator';
import { passwordStrengthValidator } from '../../../validators/sync-validator/password-strength.validator';
import { ChangePasswordRequest } from '../../../model/account/change-password-request.model';
import { AccountService } from '../../../services/account.service';
import { MessageModalComponent } from '../../../shared-component/message-modal/message-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MessageModalComponent,
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css',
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  form: any;
  isProcessing: boolean = false;
  isOpenMessageModal: boolean = false;
  title: string = '';
  message: string = '';

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group(
      {
        oldPassword: [
          '',
          {
            validators: [Validators.required, Validators.minLength(5)],
          },
        ],
        newPassword: [
          '',
          {
            validators: [
              Validators.required,
              Validators.minLength(5),
              passwordStrengthValidator,
            ],
          },
        ],
        confirmPassword: [
          '',
          {
            validators: [Validators.required],
          },
        ],
      },
      {
        validator: passwordMatchValidator(),
      }
    );

    this.subscriptions.push(
      this.form.get('newPassword')?.valueChanges.subscribe(() => {
        this.form.updateValueAndValidity();
      })
    );

    this.subscriptions.push(
      this.form.get('confirmPassword')?.valueChanges.subscribe(() => {
        this.form.updateValueAndValidity();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  onSubmit() {
    this.isProcessing = true;
    const oldPassword = this.form.get('oldPassword').value;
    const newPassword = this.form.get('newPassword').value;

    const requestBody: ChangePasswordRequest = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };

    // console.log(requestBody);

    this.subscriptions.push(
      this.accountService.changePassword(requestBody).subscribe({
        next: (response) => {
          this.title = 'SUCCESS';
          this.message = 'Changing Password Successfully';
          this.isOpenMessageModal = true;
        },
        error: (err) => {
          console.log(err);
          this.isProcessing = false;
          this.title = 'ERROR';
          this.message = err.error;
          this.isOpenMessageModal = true;
        },
        complete: () => {
          this.isProcessing = false;
        },
      })
    );
  }

  closeMessageModal() {
    this.isOpenMessageModal = false;
    this.title = '';
    this.message = '';
  }
}
