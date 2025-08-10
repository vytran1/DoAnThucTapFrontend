import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { TransportDropDownList } from '../../model/transporter/transporter-drop-down-list.model';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TransporterService } from '../../services/transporter.service';
import { Subscription } from 'rxjs';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-transporter-drop-down-list',
  standalone: true,
  imports: [MatSelectModule, FormsModule, CommonModule, LoadingComponent],
  templateUrl: './transporter-drop-down-list.component.html',
  styleUrl: './transporter-drop-down-list.component.css',
})
export class TransporterDropDownListComponent implements OnInit, OnDestroy {
  isLoading = true;
  subscriptions: Subscription[] = [];

  transporterOptions: TransportDropDownList[] = [
    { id: 1, code: 'VTPOST01' },
    { id: 2, code: 'GHN001' },
    { id: 3, code: 'GHTK001' },
    { id: 4, code: 'JNT001' },
  ];

  selectedTransporterId: number | null = null;

  @Output()
  eventEmitter = new EventEmitter<number | null>();

  constructor(private transporterService: TransporterService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.transporterService.getTransporterForDropdownList().subscribe({
        next: (response) => {
          this.transporterOptions = response.body;
          this.isLoading = false;
        },
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  onSelectionChange() {
    this.eventEmitter.emit(this.selectedTransporterId);
  }
}
