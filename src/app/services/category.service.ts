import { Injectable } from '@angular/core';
import { environment } from '../../environment/environement.config';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  host = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  public getCategoriesBelongBrand(
    brandId: number
  ): Observable<HttpResponse<any>> {
    return this.httpClient.get(
      `${this.host}/api/categories/list/drop-down/${brandId}`,
      { observe: 'response' }
    );
  }
}
