import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UploadImageComponent } from '../../../shared-component/upload-image/upload-image.component';
import { Subscription } from 'rxjs';
import { ProductService } from '../../../services/product.service';
import { ProductSubImageModel } from '../../../model/product/product-sub-image.model';
import { product_images_path } from '../../../../environment/environement.config';
import { WarningModalComponent } from '../../../shared-component/warning-modal/warning-modal.component';

@Component({
  selector: 'app-product-images',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    UploadImageComponent,
    WarningModalComponent,
  ],
  templateUrl: './product-images.component.html',
  styleUrl: './product-images.component.css',
})
export class ProductImagesComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];
  prefixPath = product_images_path;

  mainImage: string = '';
  subImages: ProductSubImageModel[] = [];

  isOpenImageModal: boolean = false;
  isChangeMainImage: boolean = false;

  isOpenWarningModal: boolean = false;
  title: string = '';
  message: string = '';
  imageToDeleteId: number | null = null;
  imageToDeleteIndex: number | null = null;

  @Input()
  productId!: number;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    if (this.productId) {
      this.subscriptions.push(
        this.productService.getAllImageInformation(this.productId).subscribe({
          next: (response) => {
            console.log(response);
            this.mainImage = response.body.mainImage;
            this.subImages = response.body.subImages;
          },
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  changeMainImage() {
    console.log('Change Image');
  }
  removeSubImage() {
    if (this.imageToDeleteId !== null && this.imageToDeleteIndex !== null) {
      this.productService.deleteSubImage(this.imageToDeleteId).subscribe({
        next: () => {
          this.subImages.splice(this.imageToDeleteIndex!, 1);
          this.resetDeleteState();
        },
        error: (err) => {
          console.error('Lỗi khi xóa ảnh:', err);
          this.resetDeleteState();
        },
      });
    }
  }
  addSubImage() {
    const newImage = prompt('Nhập URL ảnh mới cho ảnh phụ:');
  }

  closeModalImage() {
    this.isOpenImageModal = false;
    this.isChangeMainImage = false;
  }

  openModalForChangeMainImage() {
    this.isChangeMainImage = true;
    this.isOpenImageModal = true;
  }

  openModalForAddSubImage() {
    this.isChangeMainImage = false;
    this.isOpenImageModal = true;
  }

  handleImage(event: File) {
    if (this.isChangeMainImage) {
      this.subscriptions.push(
        this.productService.changeMainImage(this.productId, event).subscribe({
          next: (response) => {
            console.log(response);
            this.mainImage = response.body.image;
            this.isChangeMainImage = false;
            this.isOpenImageModal = false;
          },
          error: (err) => {
            console.log(err);
          },
        })
      );
    } else {
      this.subscriptions.push(
        this.productService.addSubImage(this.productId, event).subscribe({
          next: (response) => {
            console.log(response);
            this.subImages.push(response.body);
            this.isOpenImageModal = false;
          },
          error: (err) => {
            console.log(err);
          },
        })
      );
    }
  }

  openWarningModal(index: number, id: number) {
    this.title = 'Warning';
    this.message = 'Do You Really Want To Delete This Sub Image';
    this.imageToDeleteId = id;
    this.imageToDeleteIndex = index;
    this.isOpenWarningModal = true;
  }

  closeWarningModal() {
    this.isOpenWarningModal = false;
  }

  resetDeleteState() {
    this.imageToDeleteId = null;
    this.imageToDeleteIndex = null;
    this.isOpenWarningModal = false;
  }
}
