import { Injectable } from '@angular/core';
import { environment } from '../../environment/environement.config';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { CheckExistOfSkuCodeModel } from '../model/product/check-exist-skucode.model';
import { ProductVariantDetailModel } from '../model/product/product-variant-detail.model';

@Injectable({
  providedIn: 'root',
})
export class ProductVariantService {
  host = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  public checkExistOfSkuCode(skuCode: string): Observable<boolean> {
    return this.httpClient
      .get<CheckExistOfSkuCodeModel>(
        `${this.host}/api/variants/exist/skuCode/${skuCode}`,
        {
          observe: 'response',
        }
      )
      .pipe(
        tap((res) => console.log('🔍 Full HTTP response:', res)),
        map((res) => res.body?.dupplicate ?? false)
      );
  }

  public updateVariant(
    variant: ProductVariantDetailModel
  ): Observable<HttpResponse<any>> {
    return this.httpClient.put(`${this.host}/api/variants/update`, variant, {
      observe: 'response',
    });
  }
}
