import { Injectable } from '@angular/core';
import { environment } from '../../environment/environement.config';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VinventoryService {
  host = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  public getInventoriesDropDownList(): Observable<HttpResponse<any>> {
    return this.httpClient.get(`${this.host}/api/inventory/drop-down`, {
      observe: 'response',
    });
  }
}
