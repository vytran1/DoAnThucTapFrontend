import { Injectable } from '@angular/core';
import { environment } from '../../environment/environement.config';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductInfoAggregateModel } from '../model/product/product-info-aggregate.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  host = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  public saveProduct(
    requestBody: ProductInfoAggregateModel
  ): Observable<HttpResponse<any>> {
    return this.httpClient.post(`${this.host}/api/products`, requestBody, {
      observe: 'response',
    });
  }
}
