import { Injectable } from '@angular/core';
import { environment } from '../../environment/environement.config';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  host = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  public getAllSupplierForDropdownList(): Observable<HttpResponse<any>> {
    return this.httpClient.get(`${this.host}/api/suppliers/get/drop-down`, {
      observe: 'response',
    });
  }
}
