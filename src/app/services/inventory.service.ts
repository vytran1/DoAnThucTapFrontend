import { Injectable } from '@angular/core';
import { environment } from '../../environment/environement.config';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  host = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  public searchByName(name: string): Observable<HttpResponse<any>> {
    return this.httpClient.get(
      `${this.host}/api/inventory/search/name/${name}`,
      { observe: 'response' }
    );
  }
}
