import { Injectable } from '@angular/core';
import { environment } from '../../environment/environement.config';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ReportRequest } from '../model/reports/report-request.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  host = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  public fetchRevenueReportDataForAdmin(
    request: ReportRequest
  ): Observable<HttpResponse<any>> {
    return this.httpClient.post(`${this.host}/api/reports/admin`, request, {
      observe: 'response',
    });
  }

  public fetchRevenueReportDataForDirector(
    request: ReportRequest
  ): Observable<HttpResponse<any>> {
    return this.httpClient.post(`${this.host}/api/reports/director`, request, {
      observe: 'response',
    });
  }
}
