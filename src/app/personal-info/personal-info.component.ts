import { Component, ViewEncapsulation } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { GeneralInfoComponent } from './sub-components/general-info/general-info.component';
import { ChangePasswordComponent } from './sub-components/change-password/change-password.component';
import { ChangeImageComponent } from './sub-components/change-image/change-image.component';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [
    MatTabsModule,
    GeneralInfoComponent,
    ChangePasswordComponent,
    ChangeImageComponent,
  ],
  templateUrl: './personal-info.component.html',
  styleUrl: './personal-info.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class PersonalInfoComponent {}
