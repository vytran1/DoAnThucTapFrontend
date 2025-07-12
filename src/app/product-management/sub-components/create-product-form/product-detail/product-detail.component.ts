import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { checkExistOfSkuCodeValidator } from '../../../../validators/async-validator/check-exist-skucode.validator';
import { ProductVariantService } from '../../../../services/product-variant.service';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrandService } from '../../../../services/brand.service';
import { Subscription } from 'rxjs';
import { BrandDropdownListModel } from '../../../../model/brand/brand-dropdown-list.model';
import { CategoryService } from '../../../../services/category.service';
import { CategoryDropDownModel } from '../../../../model/category/category-dropdown-list.model';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    JsonPipe,
  ],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  form: any;
  isBrandLoaded: boolean = false;
  subscriptions: Subscription[] = [];
  @Output() productInfoChanged = new EventEmitter<{
    name: string;
    sku: string;
  }>();

  brandList: BrandDropdownListModel[] = [
    { id: 1, name: 'Dell' },
    { id: 2, name: 'HP' },
    { id: 3, name: 'Lenovo' },
    { id: 4, name: 'Asus' },
    { id: 5, name: 'Acer' },
  ];

  categoryList: CategoryDropDownModel[] = [];

  constructor(
    private fb: FormBuilder,
    private productVariantService: ProductVariantService,
    private brandService: BrandService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      product_name: [
        '',
        {
          validators: [Validators.required, Validators.minLength(5)],
          updateOn: 'blur',
        },
      ],
      sku: [
        '',
        {
          validators: [Validators.required],
          asyncValidators: [
            checkExistOfSkuCodeValidator(this.productVariantService),
          ],
          updateOn: 'blur',
        },
      ],
      brand: [null, Validators.required],
      category: [null, Validators.required],
    });

    this.subscriptions.push(
      this.form.get('brand')!.valueChanges.subscribe((brandId: number) => {
        if (brandId) {
          this.categoryService.getCategoriesBelongBrand(brandId).subscribe({
            next: (response) => {
              this.categoryList = response.body ?? [];
              this.form.get('category')!.setValue(null); // reset category nếu brand đổi
            },
          });
        } else {
          this.categoryList = [];
          this.form.get('category')!.setValue(null);
        }
      })
    );

    this.form.statusChanges.subscribe((status: any) => {
      if (status === 'VALID') {
        this.productInfoChanged.emit({
          name: this.form.get('product_name')?.value,
          sku: this.form.get('sku')?.value,
        });
      }
    });
  }

  onBrandSelectOpened() {
    console.log(this.brandList);

    if (!this.isBrandLoaded) {
      this.subscriptions.push(
        this.brandService.getAllBrandForDropdown().subscribe({
          next: (response) => {
            console.log(response);
            console.log(response.body);
            this.brandList = response.body ?? [];
            this.isBrandLoaded = true;
          },
          error: (err) => {
            console.log(err);
          },
        })
      );
    }
  }

  getValueInForm(): any | null {
    return this.form.valid ? this.form.getRawValue() : null;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
