import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { OrderOverviewComponent } from '../order-overview/order-overview.component';
import { OrderStatussComponent } from '../order-statuss/order-statuss.component';
import { OrderQuotePriceComponent } from '../order-quote-price/order-quote-price.component';
@Component({
  selector: 'app-order-details-page',
  standalone: true,
  imports: [
    MatTabsModule,
    OrderOverviewComponent,
    OrderStatussComponent,
    OrderQuotePriceComponent,
  ],
  templateUrl: './order-details-page.component.html',
  styleUrl: './order-details-page.component.css',
})
export class OrderDetailsPageComponent {
  orderId!: number;
  tabs = [{ label: 'Overview' }, { label: 'Status' }, { label: 'Quote' }];

  constructor(private activeRoute: ActivatedRoute) {}

  selectedIndex = 0;

  ngOnInit(): void {
    this.orderId = Number(this.activeRoute.snapshot.paramMap.get('orderId'));
  }
}
