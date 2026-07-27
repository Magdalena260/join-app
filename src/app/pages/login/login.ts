import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login implements OnInit {
  constructor(private router: Router) {}
  
  /**
   * Reactive signal controlling the splash screen animation state.
   * True if the splash screen is currently active/animating, false otherwise.
   */
  public isAnimating = signal<boolean>(true);

  /**
   * Reactive signal controlling whether the password input content is masked.
   * True shows asterisks (password type), false reveals the plain text.
   */
  public hidePassword = signal<boolean>(true);

  /**
   * Reactive signal tracking if the user has typed anything into the password field.
   * Used to swap between the static lock icon and interactive eye icons.
   */
  public hasPasswordText = signal<boolean>(false);

  /**
   * Reactive signal holding the current value of the email input field.
   */
  public emailValue = signal<string>('');

  /**
   * Reactive signal holding the current value of the password input field.
   */
  public passwordValue = signal<string>('');

  /**
   * Reactive signal controlling the visibility of the global validation error message.
   * True if the credentials failed validation checks, false otherwise.
   */
  public showError = signal<boolean>(false);

  /**
   * Lifecycle hook that initializes the component and triggers the splash screen transition.
   */
  public ngOnInit(): void {
    this.startSplashTransition();
  }

  /**
   * Initiates the transition from the full-screen splash logo to the corner login logo
   * after a predefined timeout delay.
   * 
   * @private
   */
  private startSplashTransition(): void {
    const animationDelayMs = 1200;

    setTimeout(() => {
      this.isAnimating.set(false);
    }, animationDelayMs);
  }

  /**
   * Toggles the visibility state of the password input field between plain text and masked text.
   */
  public togglePasswordVisibility(): void {
    this.hidePassword.update(value => !value);
  }

  /**
   * Listens to input events on the email field to update the reactive value signal.
   * Automatically clears the validation error message state once the user resumes typing.
   * 
   * @param {Event} event - The HTML input event from the template.
   */
  public onEmailInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.emailValue.set(input.value);
    
    this.showError.set(false);
  }

  /**
   * Listens to input events on the password field to dynamically show the correct control icons.
   * Resets visibility to hidden if the field becomes completely empty.
   * Automatically clears the validation error message state once the user resumes typing.
   * 
   * @param {Event} event - The HTML input event from the template.
   */
  public onPasswordInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.passwordValue.set(input.value);
    this.hasPasswordText.set(input.value.length > 0);
    
    if (input.value.length === 0) {
      this.hidePassword.set(true);
    }

    this.showError.set(false);
  }

  /**
   * Validates the form data on submission. Verifies basic syntax requirements
   * and non-empty values before performing a simulated mock credential check.
   * Redirects to the contacts view on success or triggers error signals on failure.
   * 
   * @param {Event} event - The HTML form submission event.
   */
  public onLoginSubmit(event: Event): void {
    event.preventDefault();

    const email = this.emailValue().trim();
    const password = this.passwordValue();

    const isEmailInvalid = email.length === 0 || !email.includes('@');
    const isPasswordInvalid = password.length === 0;

    if (isEmailInvalid || isPasswordInvalid) {
      this.showError.set(true);
      return;
    }

    // --- TEMPORÄRER DB-TEST-BLOCK (MOCK) ---
    // Simuliert den Datenbank-Abgleich deines Gruppenmitglieds vorab lokal.
    const mockEmail = 'test@join.com';
    const mockPassword = 'password123';

    if (email === mockEmail && password === mockPassword) {
      this.showError.set(false);
      this.router.navigate(['/contacts']);  // Später zu summary!
    } else {
      this.showError.set(true);
    }
  }

  /**
   * Handles the guest login action by programmatically navigating 
   * the user directly to the application dashboard.
   */
  public onGuestLogin(): void {
    this.router.navigate(['/contacts']);
  }

  /**
   * Handles the navigation to the sign-up page when the header button is clicked.
   */
  public onSignupClick(): void {
    this.router.navigate(['/sign-up']);
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
}