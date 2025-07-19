import { Injectable } from '@angular/core';
import { environment } from '../../environment/environement.config';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  switchMap,
  tap,
} from 'rxjs';
import { CheckExistOfSkuCodeModel } from '../model/product/check-exist-skucode.model';
import { ProductVariantDetailModel } from '../model/product/product-variant-detail.model';
import { ProductVariantForTransactionModel } from '../model/product/product-variant-for-transaction.model';

@Injectable({
  providedIn: 'root',
})
export class ProductVariantService {
  host = environment.apiUrl;

  productVariantSubject = new BehaviorSubject<
    ProductVariantForTransactionModel[]
  >([]);
  productVariant$ = this.productVariantSubject.asObservable();

  private pageNumSubject = new BehaviorSubject<number>(1);
  private pageSizeSubject = new BehaviorSubject<number>(50);
  private sortFieldSubject = new BehaviorSubject<string>('id');
  private sortDirSubject = new BehaviorSubject<string>('asc');
  private totalPageSubject = new BehaviorSubject<number>(0);
  private totalItemsSubject = new BehaviorSubject<number>(0);
  private nameSubject = new BehaviorSubject<string>('');
  private categorySubject = new BehaviorSubject<number | null>(null);

  totalPage$ = this.totalPageSubject.asObservable();
  totalItems$ = this.totalItemsSubject.asObservable();

  constructor(private httpClient: HttpClient) {
    combineLatest([
      this.pageNumSubject,
      this.pageSizeSubject,
      this.sortFieldSubject,
      this.sortDirSubject,
      this.nameSubject,
      this.categorySubject,
    ])
      .pipe(
        switchMap(
          ([pageNum, pageSize, sortField, sortDir, name, categoryId]) => {
            return this.search(
              pageNum,
              pageSize,
              sortField,
              sortDir,
              name,
              categoryId
            );
          }
        )
      )
      .subscribe({
        next: (response) => {
          console.log(response);
          if (response.body) {
            const body = response.body as any;
            this.productVariantSubject.next(body.variants);
            this.totalItemsSubject.next(body.page.totalItems);
            this.totalPageSubject.next(body.page.totalPages);
          }
        },
      });
  }

  public checkExistOfSkuCode(skuCode: string): Observable<boolean> {
    return this.httpClient
      .get<CheckExistOfSkuCodeModel>(
        `${this.host}/api/variants/exist/skuCode/${skuCode}`,
        {
          observe: 'response',
        }
      )
      .pipe(
        tap((res) => console.log('🔍 Full HTTP response:', res)),
        map((res) => res.body?.dupplicate ?? false)
      );
  }

  public updateVariant(
    variant: ProductVariantDetailModel
  ): Observable<HttpResponse<any>> {
    return this.httpClient.put(`${this.host}/api/variants/update`, variant, {
      observe: 'response',
    });
  }

  public search(
    pageNum: number,
    pageSize: number,
    sortField: string,
    sortDir: string,
    name: string,
    categoryId: number | null
  ) {
    let params = new HttpParams();
    params = params.append('pageNum', pageNum.toString());
    params = params.append('pageSize', pageSize.toString());
    params = params.append('sortField', sortField);
    params = params.append('sortDir', sortDir);
    params = params.append('name', name);
    params =
      categoryId != null
        ? params.append('categoryId', categoryId.toString())
        : params;
    return this.httpClient.get(`${this.host}/api/variants/search`, {
      observe: 'response',
      params: params,
    });
  }

  onPageChange(page: number) {
    this.pageNumSubject.next(page);
  }

  setCategory(categoryId: number | null) {
    this.categorySubject.next(categoryId);
    this.pageNumSubject.next(1);
  }

  setSearchName(name: string) {
    this.nameSubject.next(name);
  }
}
