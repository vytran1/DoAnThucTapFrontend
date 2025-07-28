import { Injectable } from '@angular/core';
import { environment } from '../../environment/environement.config';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Invoice } from '../model/invoice/invoice-save.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  host = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  save(requestBody: Invoice): Observable<Blob> {
    return this.httpClient.post(
      'http://localhost:8080/api/invoices',
      requestBody,
      {
        responseType: 'blob',
      }
    );
  }
}
