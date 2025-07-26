import { Injectable } from '@angular/core';
import { environment } from '../../environment/environement.config';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, combineLatest, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchingService {
  host = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  private pageNumSubject = new BehaviorSubject<number>(1);
  private pageSizeSubject = new BehaviorSubject<number>(50);
  private sortFieldSubject = new BehaviorSubject<string>('id');
  private sortDirSubject = new BehaviorSubject<string>('asc');
  private totalPageSubject = new BehaviorSubject<number>(0);
  private totalItemsSubject = new BehaviorSubject<number>(0);
  private nameSubject = new BehaviorSubject<string>('');
  private categorySubject = new BehaviorSubject<number | null>(null);

  totalPage$ = this.totalPageSubject.asObservable();
  totalItem$ = this.totalItemsSubject.asObservable();

  public searchTrigger$ = combineLatest([
    this.pageNumSubject,
    this.pageSizeSubject,
    this.sortFieldSubject,
    this.sortDirSubject,
    this.nameSubject,
    this.categorySubject,
  ]).pipe(
    switchMap(([pageNum, pageSize, sortField, sortDir, name, categoryId]) =>
      this.getProductWithStock(
        pageNum,
        pageSize,
        sortField,
        sortDir,
        name,
        categoryId
      )
    )
  );

  getProductWithStock(
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
    return this.httpClient.get(`${this.host}/api/variants/search/sale`, {
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
