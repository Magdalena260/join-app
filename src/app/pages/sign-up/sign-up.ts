import { Component, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { LogoDark } from '../../shared/components/logo-dark/logo-dark';
import { AuthService } from '../../shared/services/auth-service';
import { contactsService } from '../../shared/services/contacts-service';


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
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required]),
    privacyAccepted: new FormControl(false, [Validators.requiredTrue])
  }, { validators: this.passwordMatchValidator });

  /**
   * Tracks whether the primary password input field has lost focus after user interaction.
   * Prevents formatting errors from flashing prematurely when clicking visibility toggle elements.
   */
  public passwordControlTouched = false;

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
   * Reactive signal tracking if the user has supplied content within the primary password box boundary.
   * Determines visual layout choices between static locks and interactive view toggles.
   */
  public hasPasswordText = signal<boolean>(false);

  /**
   * Reactive signal tracking if the user has supplied content within the confirmation password box boundary.
   * Determines visual choices between static locks and interactive view toggles.
   */
  public hasConfirmPasswordText = signal<boolean>(false);
  
  /**
   * Reactive signal controlling the visual presence of the success toast notification.
   * True displays the toast on screen, false keeps it hidden.
   */
  public showSuccessToast = signal<boolean>(false);

  /**
   * Prevents duplicate sign-up requests while the current submission is still running.
   */
  public isSubmitting = signal<boolean>(false);

  /**
   * Initializes the component with dependency injection.
   * 
   * @param {Router} router - The Angular router service for programmatic navigation.
   * @param {AuthService} authService - Service managing user registration and authentication handshakes.
   * @param {contactsService} contactsService - Service handling creation and management of user contacts.
   */
  constructor(private router: Router, private authService: AuthService, private contactsService: contactsService) {}

  /**
   * Explicitly updates the validation interaction state when the primary password field loses focus.
   */
  public onPasswordBlur(): void {
    this.passwordControlTouched = true;
  }

  /**
   * Explicitly updates the validation interaction state when the confirmation password field loses focus.
   */
  public onConfirmPasswordBlur(): void {
    this.signUpForm.get('confirmPassword')?.markAsTouched();
  }

  /**
   * Synchronizes the text input event of the primary password control with the reactive state graph.
   * Safely resets masking styles if content parameters shift back to empty states.
   * 
   * @param {Event} event - Intercepted DOM interface payload sourced from input nodes.
   */
  public onPasswordInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.hasPasswordText.set(input.value.length > 0);
    if (input.value.length === 0) {
      this.hidePassword.set(true);
    }
  }

  /**
   * Synchronizes the text input event of the confirmation password control with the reactive state graph.
   * Safely resets masking styles if content parameters shift back to empty states.
   * 
   * @param {Event} event - Intercepted DOM interface payload sourced from input nodes.
   */
  public onConfirmPasswordInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.hasConfirmPasswordText.set(input.value.length > 0);
    if (input.value.length === 0) {
      this.hideConfirmPassword.set(true);
    }
  }

  /**
   * Determines whether the password mismatch error text should be displayed in the UI.
   * Returns true only if the passwords do not match and the user has left the confirmation input field.
   * 
   * @returns {boolean} True if the error should be visible, false otherwise.
   */
  public shouldShowPasswordError(): boolean {
    const confirmControl = this.signUpForm.get('confirmPassword');

    if (this.signUpForm.valid || !this.signUpForm.hasError('passwordMismatch')) {
      return false;
    }

    return !!confirmControl?.touched;
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
   * 
   * @returns {Promise<void>} A promise that resolves when the signup process and routing conclude.
   */
  public async onSignUpSubmit(): Promise<void> {
    if (this.signUpForm.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);

    const email = this.signUpForm.value.email ?? '';
    const password = this.signUpForm.value.password ?? '';

    const { error } = await this.authService.signUp(email, password);

    const name = this.signUpForm.controls.name.value!.trim();
    const emailtrim = this.signUpForm.controls.email.value!.trim();

    const [firstname, ...lastnameParts] = name.split(/\s+/);


    await this.contactsService.setContact([{
      firstname: firstname,
      lastname: lastnameParts.join(' '),
      telephone: '',
      email: emailtrim,
    }]);

    if (error) {
      console.error(error);
      return;
    }

    this.showSuccessToast.set(true);

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 800);

    this.isSubmitting.set(false);
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
