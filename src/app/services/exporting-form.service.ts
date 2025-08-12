import { Injectable } from '@angular/core';
import { environment } from '../../environment/environement.config';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { ExportingFormAggregator } from '../model/exporting-form/exporting-form-aggregator.model';
import { BehaviorSubject, combineLatest, Observable, switchMap } from 'rxjs';
import { ExportingFormPage } from '../model/exporting-form/exporting-form-page.model';

@Injectable({
  providedIn: 'root',
})
export class ExportingFormService {
  host = environment.apiUrl;

  exportingFormSubject = new BehaviorSubject<ExportingFormPage[]>([]);
  exportingForm$ = this.exportingFormSubject.asObservable();

  private pageNumSubject = new BehaviorSubject<number>(1);
  private pageSizeSubject = new BehaviorSubject<number>(10);
  private sortFieldSubject = new BehaviorSubject<string>('id');
  private sortDirSubject = new BehaviorSubject<string>('asc');
  private totalPageSubject = new BehaviorSubject<number>(0);
  private totalItemsSubject = new BehaviorSubject<number>(0);
  private startDateSubject = new BehaviorSubject<string | null>(null);
  private endDateSubject = new BehaviorSubject<string | null>(null);

  totalPage$ = this.totalPageSubject.asObservable();
  totalItem$ = this.totalItemsSubject.asObservable();

  public searchTrigger$ = combineLatest([
    this.pageNumSubject,
    this.pageSizeSubject,
    this.sortFieldSubject,
    this.sortDirSubject,
    this.startDateSubject,
    this.endDateSubject,
  ]).pipe(
    switchMap(([pageNum, pageSize, sortField, sortDir, startDate, endDate]) =>
      this.search(pageNum, pageSize, sortField, sortDir, startDate, endDate)
    )
  );

  constructor(private httpClient: HttpClient) {}

  public search(
    pageNum: number,
    pageSize: number,
    sortField: string,
    sortDir: string,
    startDate: string | null,
    endDate: string | null
  ): Observable<HttpResponse<any>> {
    let params = new HttpParams();
    params = params.append('pageNum', pageNum.toString());
    params = params.append('pageSize', pageSize.toString());
    params = params.append('sortField', sortField);
    params = params.append('sortDir', sortDir);
    if (startDate && endDate) {
      params = params.append('startDate', startDate);
      params = params.append('endDate', endDate);
    }

    return this.httpClient.get(`${this.host}/api/exporting_form/search`, {
      params: params,
      observe: 'response',
    });
  }

  onPageChange(page: number) {
    this.pageNumSubject.next(page);
  }

  setDate(start: string | null, end: string | null): void {
    this.startDateSubject.next(start);
    this.endDateSubject.next(end);
  }

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
