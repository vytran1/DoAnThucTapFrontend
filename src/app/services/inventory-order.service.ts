import { Injectable } from '@angular/core';
import { environment } from '../../environment/environement.config';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderAggregator } from '../model/inventory-order/order-aggregator.model';

@Injectable({
  providedIn: 'root',
})
export class InventoryOrderService {
  host = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  public saveOrder(
    requestBody: OrderAggregator
  ): Observable<HttpResponse<any>> {
    return this.httpClient.post(`${this.host}/api/orders`, requestBody, {
      observe: 'response',
    });
  }

  public getOverview(id: number): Observable<HttpResponse<any>> {
    return this.httpClient.get(`${this.host}/api/orders/${id}/overview`, {
      observe: 'response',
    });
  }

  public getStatus(id: number): Observable<HttpResponse<any>> {
    return this.httpClient.get(`${this.host}/api/orders/${id}/status`, {
      observe: 'response',
    });
  }
}
