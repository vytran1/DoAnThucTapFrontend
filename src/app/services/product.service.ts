import { Injectable } from '@angular/core';
import { environment } from '../../environment/environement.config';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, combineLatest, Observable, switchMap } from 'rxjs';
import { ProductInfoAggregateModel } from '../model/product/product-info-aggregate.model';
import { ProductByPageModel } from '../model/product/product-by-page.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  host = environment.apiUrl;
  productsSubject = new BehaviorSubject<ProductByPageModel[]>([]);
  products$ = this.productsSubject.asObservable();

  private pageNumSubject = new BehaviorSubject<number>(1);
  private pageSizeSubject = new BehaviorSubject<number>(2);
  private sortFieldSubject = new BehaviorSubject<string>('id');
  private sortDirSubject = new BehaviorSubject<string>('asc');
  private totalPageSubject = new BehaviorSubject<number>(0);
  private totalItemsSubject = new BehaviorSubject<number>(0);

  totalPage$ = this.totalPageSubject.asObservable();
  totalItems$ = this.totalItemsSubject.asObservable();

  constructor(private httpClient: HttpClient) {
    combineLatest([
      this.pageNumSubject,
      this.pageSizeSubject,
      this.sortFieldSubject,
      this.sortDirSubject,
    ])
      .pipe(
        switchMap(([pageNum, pageSize, sortField, sortDir]) => {
          return this.getAllProductByPage(
            pageNum,
            pageSize,
            sortField,
            sortDir
          );
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Call API GET PRODUCT');
          if (response.body) {
            console.log(response);
            console.log(response.body);

            this.productsSubject.next(response.body.products);
            this.totalItemsSubject.next(response.body.page.totalItems);
            this.totalPageSubject.next(response.body.page.totalPages);
          }
        },
      });
  }

  public saveProduct(
    requestBody: ProductInfoAggregateModel
  ): Observable<HttpResponse<any>> {
    return this.httpClient.post(`${this.host}/api/products`, requestBody, {
      observe: 'response',
    });
  }

  public getAllProductByPage(
    pageNum: number,
    pageSize: number,
    sortField: string,
    sortDir: string
  ): Observable<HttpResponse<any>> {
    let params = new HttpParams();
    params = params.append('pageNum', pageNum.toString());
    params = params.append('pageSize', pageSize.toString());
    params = params.append('sortField', sortField);
    params = params.append('sortDir', sortDir);

    return this.httpClient.get(`${this.host}/api/products`, {
      observe: 'response',
      params: params,
    });
  }

  updatePageNum(page: number) {
    this.pageNumSubject.next(page);
  }

  updatePageSize(size: number) {
    this.pageSizeSubject.next(size);
  }

  updateSort(field: string, dir: 'asc' | 'desc') {
    this.sortFieldSubject.next(field);
    this.sortDirSubject.next(dir);
  }
}
