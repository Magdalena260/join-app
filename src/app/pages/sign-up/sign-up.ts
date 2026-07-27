import { Component, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { LogoDark } from '../../shared/components/logo-dark/logo-dark';

/**
 * Component handling the registration process for new users.
 * Utilizes Angular Reactive Forms for automated validation and custom password matching logic,
 * combined with signals for fluid UI state management.
 */
@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, LogoDark],
  templateUrl: './sign-up.html',
  styleUrls: ['./sign-up.scss'],
})
export class SignUp {
  /**
   * Root FormGroup object aggregating and managing validation rules for all registration inputs.
   */
  public signUpForm = new FormGroup({
    name: new FormControl('', [
      Validators.required, 
      Validators.minLength(2),
      Validators.pattern(/^[a-zA-ZäöüÄÖÜß\s-]+$/)
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)]),
    confirmPassword: new FormControl('', [Validators.required]),
    privacyAccepted: new FormControl(false, [Validators.requiredTrue])
  }, { validators: this.passwordMatchValidator });

  /**
   * Reactive signal controlling whether the primary password input content is masked.
   * True shows asterisks, false reveals plain text.
   */
  public hidePassword = signal<boolean>(true);

  /**
   * Reactive signal controlling whether the confirmation password input content is masked.
   * True shows asterisks, false reveals plain text.
   */
  public hideConfirmPassword = signal<boolean>(true);
  
  /**
   * Reactive signal controlling the visual presence of the success toast notification.
   * True displays the toast on screen, false keeps it hidden.
   */
  public showSuccessToast = signal<boolean>(false);

  /**
   * Initializes the component with dependency injection.
   * 
   * @param {Router} router - The Angular router service for programmatic navigation.
   */
  constructor(private router: Router) {}

  /**
   * Determines whether the password mismatch error text should be displayed in the UI.
   * Returns true only if the passwords do not match and the user has finished typing 
   * or left the confirmation input field.
   * 
   * @returns {boolean} True if the error should be visible, false otherwise.
   */
  public shouldShowPasswordError(): boolean {
    const password = this.signUpForm.get('password')?.value || '';
    const confirmPassword = this.signUpForm.get('confirmPassword')?.value || '';
    const confirmControl = this.signUpForm.get('confirmPassword');

    if (this.signUpForm.valid || !this.signUpForm.hasError('passwordMismatch') || confirmPassword === '') {
      return false;
    }

    return !!confirmControl?.touched || confirmPassword.length >= password.length;
  }

  /**
   * Toggles the visibility state of the primary password field between plain text and masked text.
   */
  public togglePasswordVisibility(): void {
    this.hidePassword.update(value => !value);
  }

  /**
   * Toggles the visibility state of the confirmation password field between plain text and masked text.
   */
  public toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword.update(value => !value);
  }

  /**
   * Handles the programmatic form submission logic. Halts execution if the reactive form group is invalid.
   * Displays a visual success confirmation feedback toast before navigating back to the login view.
   */
  public onSignUpSubmit(): void {
    if (this.signUpForm.invalid) return;

    const { name, email } = this.signUpForm.value;
    console.log('Registration submitted for:', name, email);

    this.showSuccessToast.set(true);

    const navigationDelayMs = 800;
    setTimeout(() => {
      this.router.navigate(['/login']); 
    }, navigationDelayMs);
  }

  /**
   * Aborts the registration flow and returns the user to the default authentication view.
   */
  public onBackToLogin(): void {
    this.router.navigate(['/login']);
  }

  /**
   * Navigates the user instantly to the external privacy policy view.
   */
  public onPrivacyPolicyClick(): void {
    this.router.navigate(['/privacy-policy']);
  }

  /**
   * Navigates the user instantly to the external legal notice view.
   */
  public onLegalNoticeClick(): void {
    this.router.navigate(['/legal-notice']);
  }

  /**
   * Custom validator executing synchronous matching validation between password and confirmPassword inputs.
   * 
   * @private
   * @param {AbstractControl} control - The parent cross-field FormGroup control instance.
   * @returns {ValidationErrors | null} An object mapping validation failure keys, or null if valid.
   */
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }
}
