import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon'; // <-- THÊM MỚI

import { Inventory } from '../model/inventory/inventory.model';
import { InventoryService, Page } from '../services/inventory.service';
import { MatProgressSpinner, MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-locations',
  templateUrl: './inventory-management.component.html',
  styleUrls: ['./inventory-management.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatPaginatorModule, // <-- THÊM VÀO IMPORTS
    MatProgressSpinnerModule // <-- THÊM VÀO IMPORTS
  ]
})
export class InventoryManagementComponent implements OnInit {

  displayedColumns: string[] = ['inventoryCode', 'name', 'address', 'numberOfOrder', 'actions'];
  // DataSource không cần khởi tạo với mảng rỗng nữa
  dataSource: MatTableDataSource<Inventory> = new MatTableDataSource();

  // THÊM CÁC THUỘC TÍNH MỚI
  isLoading = false;
  totalElements = 0;
  currentPage = 0;
  pageSize = 10;
  currentSearchTerm = '';

  // Subject để xử lý debounce cho việc search
  private searchSubject = new Subject<string>();

  // Lấy tham chiếu tới Paginator trong template
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private inventoryService: InventoryService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Tải dữ liệu cho trang đầu tiên
    this.loadInventories();
    // Cài đặt debounce cho ô tìm kiếm
    this.setupSearchDebounce();
  }

  setupSearchDebounce(): void {
    this.searchSubject.pipe(
      debounceTime(500), // Chờ 500ms sau lần gõ cuối cùng
      distinctUntilChanged(), // Chỉ tìm kiếm nếu từ khóa thay đổi
    ).subscribe(searchTerm => {
      this.currentSearchTerm = searchTerm;
      this.paginator.pageIndex = 0; // Reset về trang đầu tiên khi tìm kiếm mới
      this.currentPage = 0;
      this.loadInventories();
    });
  }

  loadInventories(): void {
    this.isLoading = true;
    
    // Bây giờ chỉ cần gọi một phương thức duy nhất
    this.inventoryService.getInventories(
      this.currentPage, 
      this.pageSize, 
      this.currentSearchTerm
    ).subscribe({
      next: (response: Page<Inventory>) => {
        this.dataSource.data = response.content;
        this.totalElements = response.totalElements;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load inventories', err); // Lỗi sẽ không còn là 400 nữa
        this.snackBar.open('Error loading inventories!', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  // Phương thức này được gọi bởi (input) trên ô search
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchSubject.next(filterValue.trim().toLowerCase());
  }
  
  // Phương thức này được gọi bởi (page) trên mat-paginator
  handlePageEvent(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadInventories();
  }

  deleteInventory(inventory: Inventory): void {
    if (!inventory || typeof inventory.id === 'undefined') {
      console.error('Invalid inventory object!');
      return;
    }

    const confirmation = window.confirm(`Bạn có chắc chắn muốn xóa kho "${inventory.inventoryName}"?`);
    
    if (confirmation) {
      this.inventoryService.deleteInventory(inventory.id).subscribe({
        next: () => {
          this.snackBar.open('Xóa kho thành công!', 'Đóng', { duration: 3000 });
          // Tải lại trang hiện tại sau khi xóa
          this.loadInventories(); 
        },
        error: (err) => {
          console.error('API error on delete:', err);
          this.snackBar.open('Lỗi khi xóa kho!', 'Đóng', { duration: 3000 });
        }
      });
    }
  }

  navigateToCreateInventory(): void {
    this.router.navigate(['/inventory/create-new']);
  }

  navigateToEdit(inventory: Inventory): void {
    this.router.navigate(['/inventory/edit', inventory.id]); 
  }
  searchByName(name: string): void { 
    if (!name || name.trim() === '') {
      this.loadInventories(); 
      return;
    }

    this.inventoryService.searchByName(name).subscribe({
      next: (response) => {
        const inventories = response.body || [];
        this.dataSource.data = inventories;
      },
      error: (err) => {
        console.error('Error searching inventories', err);
        this.snackBar.open('Error searching inventories!', 'Close', { duration: 3000 });
      }
    });
  }
}
