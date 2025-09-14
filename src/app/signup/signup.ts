import { CommonModule } from '@angular/common';

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';

import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup {
  signupForm: FormGroup;
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;
  acceptTerms = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordStrengthValidator]],
      confirmPassword: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, { 
      validators: [this.passwordMatchValidator] 
    });
  }

  // Custom validator for password strength
  passwordStrengthValidator(control: AbstractControl): {[key: string]: any} | null {
    const value = control.value;
    if (!value) return null;

    const hasNumber = /[0-9]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasSpecial = /[#?!@$%^&*-]/.test(value);
    
    const valid = hasNumber && hasUpper && hasLower && hasSpecial;
    
    if (!valid) {
      return { passwordStrength: true };
    }
    
    return null;
  }

  // Custom validator for password matching
  passwordMatchValidator(form: FormGroup): {[key: string]: any} | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (!password || !confirmPassword) return null;
    
    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      // Clear the error if passwords match
      if (confirmPassword.errors?.['passwordMismatch']) {
        delete confirmPassword.errors['passwordMismatch'];
        if (Object.keys(confirmPassword.errors).length === 0) {
          confirmPassword.setErrors(null);
        }
      }
    }
    
    return null;
  }

  onSignup() {
    if (this.signupForm.valid) {
      this.isLoading = true;
      const formData = { ...this.signupForm.value };
      delete formData.confirmPassword; // Don't send confirm password to API
      
      console.log('Signup data:', formData);
      
      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        // Navigate to login or dashboard after successful signup
        this.router.navigate(['/login'], { 
          queryParams: { message: 'Account created successfully! Please sign in.' }
        });
      }, 2000);
    } else {
      this.markFormGroupTouched();
    }
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  private markFormGroupTouched() {
    Object.keys(this.signupForm.controls).forEach(key => {
      const control = this.signupForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.signupForm.get(controlName);
    if (control?.errors && control.touched) {
      const errors = control.errors;
      
      if (errors['required']) {
        return `${this.getFieldName(controlName)} is required`;
      }
      if (errors['email']) {
        return 'Please enter a valid email address';
      }
      if (errors['minlength']) {
        const requiredLength = errors['minlength'].requiredLength;
        return `${this.getFieldName(controlName)} must be at least ${requiredLength} characters`;
      }
      if (errors['passwordStrength']) {
        return 'Password must contain uppercase, lowercase, number, and special character';
      }
      if (errors['passwordMismatch']) {
        return 'Passwords do not match';
      }
      if (errors['requiredTrue']) {
        return 'You must accept the terms and conditions';
      }
    }
    return '';
  }

  private getFieldName(controlName: string): string {
    const fieldNames: { [key: string]: string } = {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password'
    };
    return fieldNames[controlName] || controlName;
  }

  hasError(controlName: string): boolean {
    const control = this.signupForm.get(controlName);
    return !!(control?.errors && control.touched);
  }

  getPasswordStrength(): number {
    const password = this.signupForm.get('password')?.value || '';
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[#?!@$%^&*-]/.test(password)) strength += 1;
    
    return strength;
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    switch (strength) {
      case 0:
      case 1:
      case 2: return 'Weak';
      case 3: return 'Fair';
      case 4: return 'Good';
      case 5: return 'Strong';
      default: return '';
    }
  }

  getPasswordStrengthClass(): string {
    const strength = this.getPasswordStrength();
    if (strength <= 2) return 'weak';
    if (strength === 3) return 'fair';
    if (strength === 4) return 'good';
    return 'strong';
  }
}
