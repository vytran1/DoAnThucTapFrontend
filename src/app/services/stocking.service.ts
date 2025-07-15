import { Injectable } from '@angular/core';
import { environment } from '../../environment/environement.config';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StockingService {
  host = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  getStockingOfProduct(sku: string): Observable<HttpResponse<any>> {
    return this.httpClient.get(`${this.host}/api/stocking/product/${sku}`, {
      observe: 'response',
    });
  }
}
