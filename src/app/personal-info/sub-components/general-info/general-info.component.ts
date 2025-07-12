import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { PersonalInfoComponent } from '../../personal-info.component';
import { PersonalInformation } from '../../../model/account/personal-information.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { LoadingComponent } from '../../../shared-component/loading/loading.component';

@Component({
  selector: 'app-general-info',
  standalone: true,
  imports: [LoadingComponent],
  templateUrl: './general-info.component.html',
  styleUrl: './general-info.component.css',
})
export class GeneralInfoComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  info: PersonalInformation | null = null;
  role: string = '';
  inventory: string = '';
  isLoading = true;

  constructor(
    private accountService: AccountService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.accountService.getInformationOfCurrentLoggedUser().subscribe({
        next: (response) => {
          // console.log(response);
          const body = response.body;
          this.info = body;

          this.role = this.authService.getRole();
          this.inventory = this.authService.getInventoryCode();
        },
        error: (err) => {
          // console.log(err);
        },
        complete: () => {
          // console.log('Completed');
          this.isLoading = false;
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
