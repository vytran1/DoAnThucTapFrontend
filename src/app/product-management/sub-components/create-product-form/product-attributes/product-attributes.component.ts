import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  FormControl, // Import FormControl
  FormGroup, // Import FormGroup
  AbstractControl, // Import AbstractControl
} from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button'; // Ensure this is imported for buttons
import { MessageModalComponent } from '../../../../shared-component/message-modal/message-modal.component';
import { ProductVariantModel } from '../../../../model/product/product-variant-table.model';
import { ProductAttributeModel } from '../../../../model/product/product-attribute.model';

@Component({
  selector: 'app-product-attributes',
  standalone: true,
  imports: [
    MatChipsModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MessageModalComponent,
  ],
  templateUrl: './product-attributes.component.html',
  styleUrl: './product-attributes.component.css',
})
export class ProductAttributesComponent implements OnInit {
  form: FormGroup;

  @Input()
  product_name: string = '';

  @Input()
  sku: string = '';

  isOpenModalWarning: boolean = false;
  title: string = '';
  message: string = '';
  @Output() attributesEmitted = new EventEmitter<ProductAttributeModel[]>();
  @Output() variantsGenerated = new EventEmitter<ProductVariantModel[]>();

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      attributes: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    // If you need to load initial data, do it here
  }

  get attributes(): FormArray {
    return this.form.get('attributes') as FormArray;
  }

  // Helper to get a FormGroup from the FormArray at a specific index
  // This is safe because we know the items in 'attributes' FormArray are FormGroups.
  getAttributeFormGroup(index: number): FormGroup {
    return this.attributes.at(index) as FormGroup;
  }

  // REVISED getControl: Now accepts AbstractControl and safely casts to FormGroup
  // for internal use before getting the specific FormControl.
  getControl(parentControl: AbstractControl, controlName: string): FormControl {
    // Safely cast parentControl to FormGroup if it's indeed one.
    if (parentControl instanceof FormGroup) {
      const control = parentControl.get(controlName);
      if (control instanceof FormControl) {
        return control;
      }
      // This case means the control name exists but isn't a FormControl (e.g., it's a FormArray or FormGroup)
      throw new Error(
        `Control '${controlName}' found but is not a FormControl.`
      );
    }
    // This case means parentControl is not a FormGroup (e.g., it's a FormControl directly)
    throw new Error(`Parent control is not a FormGroup.`);
  }

  addAttribute() {
    const attributeGroup = this.fb.group({
      name: [''],
      values: [[]],
      newValueInput: [''], // Essential for the input binding
    });
    this.attributes.push(attributeGroup);
  }

  removeAttribute(index: number) {
    this.attributes.removeAt(index);
  }

  addValue(attrIndex: number) {
    const attributeFormGroup = this.getAttributeFormGroup(attrIndex);
    const inputControl = this.getControl(attributeFormGroup, 'newValueInput'); // Use the revised getControl

    const value = inputControl.value?.trim(); // Use optional chaining just in case

    if (value) {
      const valuesArrayControl = this.getControl(
        attributeFormGroup,
        'values'
      ) as FormControl<string[]>;
      const currentValues = valuesArrayControl.value || [];

      if (!currentValues.includes(value)) {
        valuesArrayControl.setValue([...currentValues, value]);
      }
    }
    inputControl.setValue('');
  }

  removeValue(attrIndex: number, val: string) {
    const attributeFormGroup = this.getAttributeFormGroup(attrIndex);
    const valuesArrayControl = this.getControl(
      attributeFormGroup,
      'values'
    ) as FormControl<string[]>;
    const currentValues = valuesArrayControl.value || [];
    const updated = currentValues.filter((v: string) => v !== val);
    valuesArrayControl.setValue(updated);
  }

  castToFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }

  private cartesianProduct(arr: any[][]): any[][] {
    return arr.reduce(
      (a, b) => a.flatMap((d) => b.map((e) => [...d, e])),
      [[]]
    );
  }

  generateVariants() {
    if (!this.product_name || !this.sku) {
      // show warning modal nếu cần
      return;
    }

    const attributeValues = this.attributes.controls.map((attrControl) => {
      const values = this.getControl(attrControl, 'values').value;
      return values?.length ? values : [''];
    });

    const hasNoAttribute = attributeValues.every((vals) => vals.length === 0);

    let result: ProductVariantModel[];

    if (hasNoAttribute) {
      result = [
        {
          name: this.product_name,
          sku: this.sku,
        },
      ];
    } else {
      const cartesian = this.cartesianProduct(attributeValues);
      result = cartesian.map((combination, index) => ({
        name: `${this.product_name}/${combination.join('/')}`,
        sku: `${this.sku}_${index + 1}`,
      }));

      const attributes: ProductAttributeModel[] = this.attributes.controls.map(
        (attrControl) => {
          return {
            name: this.getControl(attrControl, 'name').value,
            values: this.getControl(attrControl, 'values').value ?? [],
          };
        }
      );

      this.attributesEmitted.emit(attributes);
    }

    console.log(result);

    this.variantsGenerated.emit(result);
  }

  closeModal() {
    this.title = '';
    this.message = '';
    this.isOpenModalWarning = false;
  }
}
