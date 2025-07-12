import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { map, catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { ProductVariantService } from '../../services/product-variant.service';

export function checkExistOfSkuCodeValidator(
  productVariantService: ProductVariantService
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null); // Không kiểm tra nếu không nhập
    }

    return productVariantService.checkExistOfSkuCode(control.value).pipe(
      tap(() => console.log('Checking SKU: ', control.value)),
      map((exists: boolean) => (exists ? { skuCodeExists: true } : null)),
      catchError(() => of(null)) // Không làm form lỗi nếu API lỗi
    );
  };
}
