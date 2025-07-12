import { Injectable } from '@angular/core';
import { environment } from '../../environment/environement.config';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  host = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  getAllBrandForDropdown(): Observable<HttpResponse<any>> {
    return this.httpClient.get(`${this.host}/api/brands/list/drop-down`, {
      observe: 'response',
    });
  }
}
