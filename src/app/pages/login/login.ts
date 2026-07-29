import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { AuthService } from '../../shared/services/auth-service';

/**
 * Component managing the authentication process and splash screen sequence.
 * Handles credential input, password toggles, and cross-session animation state 
 * using Angular signals and session-level storage flags.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login implements OnInit {

  async onLoginSubmit(event: Event) {
    event.preventDefault();

    const { data, error } = await this.authService.login(
      this.emailValue(),
      this.passwordValue(),
    );

    if (error || !data?.user) {
      this.showError.set(true);
      return;
    }

    this.router.navigate(['/contacts']);
  }

  /**
   * Reactive signal controlling the splash screen animation state.
   * True if the splash transition sequence is active, false once complete.
   */
  public isAnimating = signal<boolean>(true);

  /**
   * Reactive signal indicating whether the initial animation phase should be hard-bypassed.
   * True locks layout states instantly on evaluation to avoid visual stuttering.
   */
  public skipAnimation = signal<boolean>(false);

  /**
   * Reactive signal controlling whether the password input content is masked.
   * True applies bullet characters, false reveals plain text.
   */
  public hidePassword = signal<boolean>(true);

  /**
   * Reactive signal tracking if the user has supplied content within the password box boundary.
   * Determines visual layout choices between static locks and interactive view toggles.
   */
  public hasPasswordText = signal<boolean>(false);

  /**
   * Reactive signal caching the evaluated text stream from the email control element.
   */
  public emailValue = signal<string>('');

  /**
   * Reactive signal caching the evaluated text stream from the password control element.
   */
  public passwordValue = signal<string>('');

  /**
   * Reactive signal driving the visibility matrix of the general authorization failure notice block.
   */
  public showError = signal<boolean>(false);

  /**
   * Instantiates the component wrapper context and evaluates session loading footprints.
   * Hard-bypasses transition schedules immediately if past records are validated.
   * 
   * @param {Router} router - Core Angular routing layer for application state transitions.
   */
  constructor(private authService: AuthService, private router: Router) {
    const hasAnimated = sessionStorage.getItem('join_splash_done') === 'true';
    if (hasAnimated) {
      this.isAnimating.set(false);
      this.skipAnimation.set(true);
    }
  }

  /**
   * Lifecycle hook triggered instantly upon component tree evaluation.
   * Aborts transition sub-routines completely if the skip-flag matrix evaluates to true.
   */
  public ngOnInit(): void {
    if (this.skipAnimation()) {
      return;
    }
    this.startSplashTransition();
  }

  /**
   * Inverts the binary masking value to toggle raw plain-text readouts inside password fields.
   */
  public togglePasswordVisibility(): void { 
    this.hidePassword.update(value => !value); 
  }

  /**
   * Absorbs standard change flows inside the email node to synchronize the raw signal memory cache.
   * Instantly purges valid error flags to maintain fluid form states.
   * 
   * @param {Event} event - Native browser event payload intercepted from the input node boundary.
   */
  public onEmailInput(event: Event): void { 
    const input = event.target as HTMLInputElement; 
    this.emailValue.set(input.value); 
    this.showError.set(false); 
  }

  /**
   * Evaluates change patterns inside the password box to switch layout glyphs or zero out mask properties.
   * Instantly purges valid error flags to maintain fluid form states.
   * 
   * @param {Event} event - Native browser event payload intercepted from the input node boundary.
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
   * Validates explicit syntax criteria and submission shapes on interception.
   * Simulates a local secure authorization handshake before triggering programmatic routing changes.
   * 
   * @param {Event} event - Form block submit event context used to suppress raw document dispatch behaviors.
   */
  /**
   * Bypasses security parameters to route generic sessions straight to application views.
   */
  public onGuestLogin(): void { 
    this.authService.guestLogin();
    this.router.navigate(['/contacts']); 
  }

  /**
   * Triggers explicit state transitions toward registration flows.
   */
  public onSignupClick(): void { 
    this.router.navigate(['/sign-up']); 
  }

  /**
   * Dispatches explicit cross-origin routing target signals to reveal user data policy declarations.
   */
  public onPrivacyPolicyClick(): void { 
    this.router.navigate(['/privacy-policy']); 
  }

  /**
   * Dispatches explicit cross-origin routing target signals to reveal corporate legal disclosure views.
   */
  public onLegalNoticeClick(): void { 
    this.router.navigate(['/legal-notice']); 
  }

  /**
   * Spawns a deferred micro-task to transition view frameworks from baseline configurations to static nodes.
   * Flushes records to local cache layers upon complete execution loop closure.
   * 
   * @private
   */
  private startSplashTransition(): void {
    const animationDelayMs = 1200;

    setTimeout(() => {
      this.isAnimating.set(false);
      sessionStorage.setItem('join_splash_done', 'true');
    }, animationDelayMs);
  }
}
