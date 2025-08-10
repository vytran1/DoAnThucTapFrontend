import { Injectable } from '@angular/core';
import { environment } from '../../environment/environement.config';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ExportingFormAggregator } from '../model/exporting-form/exporting-form-aggregator.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExportingFormService {
  host = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  public saveExportingForm(
    requestBody: ExportingFormAggregator
  ): Observable<HttpResponse<any>> {
    return this.httpClient.post(
      `${this.host}/api/exporting_form`,
      requestBody,
      { observe: 'response' }
    );
  }

  public getExportingFormOverview(id: number): Observable<HttpResponse<any>> {
    return this.httpClient.get(
      `${this.host}/api/exporting_form/${id}/overview`,
      { observe: 'response' }
    );
  }

  public getExportingFormStatus(id: number): Observable<HttpResponse<any>> {
    return this.httpClient.get(`${this.host}/api/exporting_form/${id}/status`, {
      observe: 'response',
    });
  }

  public getExportingFormQuotePrice(id: number): Observable<HttpResponse<any>> {
    return this.httpClient.get(
      `${this.host}/api/exporting_form/${id}/quote_price`,
      {
        observe: 'response',
      }
    );
  }
}
