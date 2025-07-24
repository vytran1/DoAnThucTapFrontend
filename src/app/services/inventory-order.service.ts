import { Injectable } from '@angular/core';
import { environment } from '../../environment/environement.config';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, combineLatest, Observable, switchMap } from 'rxjs';
import { OrderAggregator } from '../model/inventory-order/order-aggregator.model';
import { OrderPage } from '../model/inventory-order/order-page.model';

@Injectable({
  providedIn: 'root',
})
export class InventoryOrderService {
  host = environment.apiUrl;

  orderSubject = new BehaviorSubject<OrderPage[]>([]);
  order$ = this.orderSubject.asObservable();

  private pageNumSubject = new BehaviorSubject<number>(1);
  private pageSizeSubject = new BehaviorSubject<number>(2);
  private sortFieldSubject = new BehaviorSubject<string>('id');
  private sortDirSubject = new BehaviorSubject<string>('asc');
  private totalPageSubject = new BehaviorSubject<number>(0);
  private totalItemsSubject = new BehaviorSubject<number>(0);
  private startDateSubject = new BehaviorSubject<string | null>(null);
  private endDateSubject = new BehaviorSubject<string | null>(null);

  totalPage$ = this.totalPageSubject.asObservable();
  totalItem$ = this.totalItemsSubject.asObservable();

  constructor(private httpClient: HttpClient) {}

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

    return this.httpClient.get(`${this.host}/api/orders/search`, {
      observe: 'response',
      params: params,
    });
  }

  public saveOrder(
    requestBody: OrderAggregator
  ): Observable<HttpResponse<any>> {
    return this.httpClient.post(`${this.host}/api/orders`, requestBody, {
      observe: 'response',
    });
  }

  public getOverview(id: number): Observable<HttpResponse<any>> {
    return this.httpClient.get(`${this.host}/api/orders/${id}/overview`, {
      observe: 'response',
    });
  }

  public getStatus(id: number): Observable<HttpResponse<any>> {
    return this.httpClient.get(`${this.host}/api/orders/${id}/status`, {
      observe: 'response',
    });
  }

  public getQuote(id: number): Observable<HttpResponse<any>> {
    return this.httpClient.get(`${this.host}/api/orders/${id}/quote`, {
      observe: 'response',
    });
  }

  public acceptQuotationByWarehouse(id: number): Observable<HttpResponse<any>> {
    return this.httpClient.get(
      `${this.host}/api/orders/${id}/quote/accept_price`,
      { observe: 'response' }
    );
  }

  public rejectQuotationByWarehouse(id: number): Observable<HttpResponse<any>> {
    return this.httpClient.post(
      `${this.host}/api/orders/${id}/quote/reject_price`,
      null,
      { observe: 'response' }
    );
  }

  public rejectOrder(id: number): Observable<HttpResponse<any>> {
    return this.httpClient.post(
      `${this.host}/api/orders/${id}/status/reject`,
      null,
      {
        observe: 'response',
      }
    );
  }

  public payingOrder(id: number): Observable<HttpResponse<any>> {
    return this.httpClient.post(
      `${this.host}/api/orders/${id}/status/paying`,
      null,
      { observe: 'response' }
    );
  }

  public updateCheckedStatus(id: number): Observable<HttpResponse<any>> {
    return this.httpClient.post(
      `${this.host}/api/orders/${id}/status/checked`,
      null,
      { observe: 'response' }
    );
  }

  public updateFinishStatus(id: number): Observable<HttpResponse<any>> {
    return this.httpClient.post(
      `${this.host}/api/orders/${id}/status/finished`,
      null,
      { observe: 'response' }
    );
  }

  onPageChange(page: number) {
    this.pageNumSubject.next(page);
  }

  setDate(start: string | null, end: string | null): void {
    this.startDateSubject.next(start);
    this.endDateSubject.next(end);
  }
}
