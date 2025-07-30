import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventory } from '../model/inventory/inventory.model';

// Interface cho đối tượng Page<> từ Spring Boot (giữ nguyên)
export interface Page<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = 'http://localhost:8080/api/v1/inventories'; // Đảm bảo URL này là chính xác
  host: any;

  constructor(private http: HttpClient) { }

  // --- CÁC PHƯƠNG THỨC PHÂN TRANG VÀ TÌM KIẾM (Đã có) ---

  getInventories(page: number, size: number, keyword: string | null, sort: string = 'id,desc'): Observable<Page<Inventory>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);

    // Chỉ thêm tham số 'keyword' vào URL nếu nó có giá trị
    if (keyword && keyword.trim() !== '') {
      params = params.set('keyword', keyword);
    }

    return this.http.get<Page<Inventory>>(this.apiUrl, { params });
  }

  searchInventories(keyword: string, page: number, size: number, sort: string = 'id,desc'): Observable<Page<Inventory>> {
    // Lưu ý: Đảm bảo bạn có endpoint "/search" ở backend
    const searchUrl = `${this.apiUrl}/search`; 
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);
    return this.http.get<Page<Inventory>>(searchUrl, { params });
  }

  // --- CÁC PHƯƠNG THỨC CRUD CÒN LẠI (THÊM VÀO) ---

  /**
   * THÊM MỚI: Lấy một kho hàng theo ID
   * Cần thiết cho trang chỉnh sửa (edit page)
   */
  getInventoryById(id: number): Observable<Inventory> {
    return this.http.get<Inventory>(`${this.apiUrl}/${id}`);
  }

  /**
   * THÊM MỚI: Tạo một kho hàng mới
   * Đây là phương thức đang bị thiếu gây ra lỗi
   */
  createInventory(inventory: Inventory): Observable<Inventory> {
    return this.http.post<Inventory>(this.apiUrl, inventory);
  }

  /**
   * THÊM MỚI: Cập nhật một kho hàng đã có
   * Cần thiết cho trang chỉnh sửa (edit page)
   */
  updateInventory(id: number, inventory: Inventory): Observable<Inventory> {
    return this.http.put<Inventory>(`${this.apiUrl}/${id}`, inventory);
  }

  /**
   * Phương thức xóa (giữ nguyên)
   */
  deleteInventory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }



   public searchByName(name: string): Observable<HttpResponse<any>> {
    return this.http.get(
      `${this.host}/api/inventory/search/name/${name}`,
      { observe: 'response' }
    );
  }
}

