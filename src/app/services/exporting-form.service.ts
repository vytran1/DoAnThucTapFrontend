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

  public updatePayingStatus(formId: number): Observable<HttpResponse<any>> {
    return this.httpClient.post(
      `${this.host}/api/exporting_form/${formId}/status/paying`,
      null,
      { observe: 'response' }
    );
  }

  public updateAcceptPrice(formId: number): Observable<HttpResponse<any>> {
    return this.httpClient.post(
      `${this.host}/api/exporting_form/${formId}/status/accept_price`,
      null,
      { observe: 'response' }
    );
  }

  public updateRejectPrice(formId: number): Observable<HttpResponse<any>> {
    return this.httpClient.post(
      `${this.host}/api/exporting_form/${formId}/status/reject_price`,
      null,
      { observe: 'response' }
    );
  }

  public updateGivingProduct(formId: number): Observable<HttpResponse<any>> {
    return this.httpClient.post(
      `${this.host}/api/exporting_form/${formId}/status/giving_product`,
      null,
      { observe: 'response' }
    );
  }

  public updateFinishStatus(formId: number): Observable<HttpResponse<any>> {
    return this.httpClient.post(
      `${this.host}/api/exporting_form/${formId}/status/finish`,
      null,
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
