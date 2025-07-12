import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordStrengthValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value || '';

  // Ví dụ yêu cầu: ít nhất 1 chữ hoa, 1 số và 1 ký tự đặc biệt
  const hasUpperCase = /[A-Z]/.test(value);
  const hasNumber = /\d/.test(value);
  const hasSpecialChar = /[\W_]/.test(value);

  const valid = hasUpperCase && hasNumber && hasSpecialChar;

  return !valid ? { weakPassword: true } : null;
}
