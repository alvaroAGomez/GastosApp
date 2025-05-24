import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (!password || !confirmPassword) return null;

  if (confirmPassword.value && password.value !== confirmPassword.value) {
    confirmPassword.setErrors({
      ...confirmPassword.errors,
      passwordMismatch: true,
    });
  } else {
    if (confirmPassword.hasError('passwordMismatch')) {
      const errors = { ...confirmPassword.errors };
      delete errors['passwordMismatch'];
      if (Object.keys(errors).length === 0) {
        confirmPassword.setErrors(null);
      } else {
        confirmPassword.setErrors(errors);
      }
    }
  }

  return password.value === confirmPassword.value
    ? null
    : { passwordMismatch: true };
};
