import { Component, ViewChild } from '@angular/core';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductAttributesComponent } from './product-attributes/product-attributes.component';
import { ProductVariantTableComponent } from './product-variant-table/product-variant-table.component';
import { ProductVariantModel } from '../../../model/product/product-variant-table.model';
import { ProductAttributeModel } from '../../../model/product/product-attribute.model';
import { MessageModalComponent } from '../../../shared-component/message-modal/message-modal.component';
import { ProductInfoAggregateModel } from '../../../model/product/product-info-aggregate.model';
import { ProductService } from '../../../services/product.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-product-form',
  standalone: true,
  imports: [
    ProductDetailComponent,
    ProductAttributesComponent,
    ProductVariantTableComponent,
    MessageModalComponent,
    CommonModule,
  ],
  templateUrl: './create-product-form.component.html',
  styleUrl: './create-product-form.component.css',
})
export class CreateProductFormComponent {
  product_name: string = '';
  skuCode: string = '';
  generatedVariants: ProductVariantModel[] = [];
  attributeList: ProductAttributeModel[] = [];
  isOpenModalWarning = false;
  title = '';
  message = '';
  isProcessing = false;

  constructor(private productService: ProductService, private router: Router) {}

  @ViewChild(ProductDetailComponent)
  productDetailComponent!: ProductDetailComponent;

  onProductInfoChanged(event: { name: string; sku: string }) {
    this.product_name = event.name;
    this.skuCode = event.sku;
    console.log('Received from child:', this.product_name, this.skuCode);
  }

  onProductVariantGenerated(event: ProductVariantModel[]) {
    this.generatedVariants = event;
  }

  onProductAttributesEmitted(event: ProductAttributeModel[]) {
    this.attributeList = event;
  }

  onSaveClick() {
    this.isProcessing = true;
    const detailInformation = this.productDetailComponent.getValueInForm();

    if (detailInformation == null) {
      this.title = 'ERROR';
      this.message = 'Please Provide full details';
      this.isOpenModalWarning = true;
      this.isProcessing = false;
      return;
    }

    // console.log('Product Details Information', detailInformation);
    // console.log('Product Attributes', this.attributeList);
    // console.log('Product Variants', this.generatedVariants);

    const requestBody: ProductInfoAggregateModel = {
      product_name: detailInformation.product_name,
      brand: detailInformation.brand,
      category: detailInformation.category,
      base_price: detailInformation.base_price,
      product_attributes: this.attributeList,
      product_variants: this.generatedVariants,
    };

    console.log('Request Body', requestBody);

    this.productService.saveProduct(requestBody).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (err) => {
        console.log(err);
        this.isProcessing = false;
      },
      complete: () => {
        this.isProcessing = false;
      },
    });
  }

  onCloseModal() {
    this.isOpenModalWarning = false;
  }

  onCancelClick() {
    this.router.navigateByUrl('/inventory/product-management');
  }
}
