import { Injectable } from '@angular/core';
import { environment } from '../../environment/environement.config';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { ReportRequest } from '../model/reports/report-request.model';
import { BehaviorSubject, combineLatest, Observable, switchMap } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  host = environment.apiUrl;

  private inventoryIdSubject = new BehaviorSubject<number | null>(null);
  private pageNumSubject = new BehaviorSubject<number>(1);
  private pageSizeSubject = new BehaviorSubject<number>(50);
  private totalPageSubject = new BehaviorSubject<number>(0);
  private totalItemsSubject = new BehaviorSubject<number>(0);

  totalPage$ = this.totalPageSubject.asObservable();
  totalItem$ = this.totalItemsSubject.asObservable();

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {
    const inventoryId = authService.getInventoryId();
    this.setInventoryId(inventoryId);
  }

  public changesTrigger$ = combineLatest([
    this.inventoryIdSubject,
    this.pageNumSubject,
    this.pageSizeSubject,
  ]).pipe(
    switchMap(([inventoryId, pageNum, pageSize]) => {
      if (this.authService.isDirector()) {
        return this.getStockingReportOfInventoryForDirector(
          inventoryId!,
          pageNum,
          pageSize
        );
      } else {
        return this.getStockingReportOfInventoryForAdmin(
          inventoryId!,
          pageNum,
          pageSize
        );
      }
    })
  );

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

  public getImportingFormReportOfInventoryForAdmin(
    request: ReportRequest
  ): Observable<HttpResponse<any>> {
    return this.httpClient.post(
      `${this.host}/api/reports/importing_form/admin`,
      request,
      {
        observe: 'response',
      }
    );
  }

  public getImportingFormReportOfInventoryForDirector(
    request: ReportRequest
  ): Observable<HttpResponse<any>> {
    return this.httpClient.post(
      `${this.host}/api/reports/importing_form/director`,
      request,
      { observe: 'response' }
    );
  }

  public getImportAndSaleReport(
    request: ReportRequest
  ): Observable<[any, any]> {
    const import$ = this.authService.isDirector()
      ? this.getImportingFormReportOfInventoryForDirector(request)
      : this.getImportingFormReportOfInventoryForAdmin(request);

    const sale$ = this.authService.isDirector()
      ? this.fetchRevenueReportDataForDirector(request)
      : this.fetchRevenueReportDataForAdmin(request);

    return combineLatest([import$, sale$]);
  }

  public getStockingReportOfInventoryForAdmin(
    inventoryId: number,
    pageNum: number,
    pageSize: number
  ): Observable<HttpResponse<any>> {
    let params = new HttpParams();
    params = params.append('pageNum', pageNum);
    params = params.append('pageSize', pageSize);

    if (inventoryId !== null && inventoryId !== undefined) {
      params = params.set('inventoryId', inventoryId);
    }

    return this.httpClient.get(`${this.host}/api/reports/stock_report/admin`, {
      observe: 'response',
      params: params,
    });
  }

  public getStockingReportOfInventoryForDirector(
    inventoryId: number,
    pageNum: number,
    pageSize: number
  ): Observable<HttpResponse<any>> {
    let params = new HttpParams();
    params = params.append('inventoryId', inventoryId);
    params = params.append('pageNum', pageNum);
    params = params.append('pageSize', pageSize);

    if (inventoryId !== null && inventoryId !== undefined) {
      params = params.set('inventoryId', inventoryId);
    }

    return this.httpClient.get(
      `${this.host}/api/reports/stock_report/director`,
      {
        observe: 'response',
        params: params,
      }
    );
  }

  public getStockingReport(
    inventoryId: number | null,
    pageNum: number,
    pageSize: number
  ): Observable<HttpResponse<any>> {
    if (this.authService.isDirector()) {
      return this.getStockingReportOfInventoryForDirector(
        inventoryId ?? 0,
        pageNum,
        pageSize
      );
    } else {
      return this.getStockingReportOfInventoryForAdmin(
        inventoryId ?? 0,
        pageNum,
        pageSize
      );
    }
  }

  public setInventoryId(id: number | null) {
    this.inventoryIdSubject.next(id);
  }

  public setPageNum(page: number) {
    this.pageNumSubject.next(page);
  }

  public setPageSize(size: number) {
    this.pageSizeSubject.next(size);
  }
}
