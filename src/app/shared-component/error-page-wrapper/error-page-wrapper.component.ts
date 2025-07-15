import { Component } from '@angular/core';
import { ErrorPageComponent } from '../error-page/error-page.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error-page-wrapper',
  standalone: true,
  template: `
    <app-error-page
      [title]="title"
      [message]="message"
      [backLabel]="backLabel"
      [backLink]="backLink"
    ></app-error-page>
  `,
  imports: [ErrorPageComponent],
})
export class ErrorPageWrapperComponent {
  title?: string;
  message?: string;
  backLabel?: string;
  backLink?: string;

  constructor(private router: Router) {
    const state = this.router.getCurrentNavigation()?.extras.state;
    this.title = state?.['title'];
    this.message = state?.['message'];
    this.backLabel = state?.['backLabel'];
    this.backLink = state?.['backLink'];
  }
}
