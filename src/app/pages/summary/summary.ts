import { Component, signal, OnInit, inject } from '@angular/core';
import { Greeting } from './greeting/greeting';
import { Cards } from './cards/cards';
import { AuthService } from '../../shared/services/auth-service';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [Greeting, Cards],
  templateUrl: './summary.html',
  styleUrl: './summary.scss',
})

export class Summary implements OnInit{

  //   /**
  //  * Reactive signal controlling the visibility state of the mobile-only intro greeting animation.
  //  */
  // protected readonly showIntroAnimation = signal<boolean>(false);

  // /**
  //  * Executed on component initialization. Checks client environment specifications 
  //  * to trigger a single-session responsive onboarding animation for mobile form factors.
  //  */
  // public ngOnInit(): void {
  //   const isMobile = window.matchMedia('(max-width: 992px)').matches;
  //   const introAlreadyShown = window.name.includes('introAnimationShown=true');

  //   if (!isMobile || introAlreadyShown) {
  //     return;
  //   }

  //   window.name = `${window.name};introAnimationShown=true`;
  //   this.showIntroAnimation.set(true);

  //   const animationDurationMs = 2000;
  //   setTimeout(() => {
  //     this.showIntroAnimation.set(false);
  //   }, animationDurationMs);
  // }

  private readonly authService = inject(AuthService);

  /**
   * Controls the mobile intro animation visibility.
   */
  protected readonly showIntroAnimation = signal(false);

  /**
   * Shows the animation once per authentication state during the session.
   */
  public async ngOnInit(): Promise<void> {
    const isMobile = window.matchMedia('(max-width: 992px)').matches;

    if (!isMobile) {
      return;
    }

    const currentUserKey = await this.getCurrentUserKey();
    const previousUserKey = sessionStorage.getItem('introAnimationUser');

    if (previousUserKey === currentUserKey) {
      return;
    }

    sessionStorage.setItem('introAnimationUser', currentUserKey);
    this.playIntroAnimation();
  }

  /**
   * Returns a unique value for the current authentication state.
   */
  private async getCurrentUserKey(): Promise<string> {
    if (!this.authService.isAuthenticated) {
      return 'guest';
    }

    const user = await this.authService.getUser();

    return user?.email
      ? `authenticated:${user.email}`
      : 'authenticated';
  }

  /**
   * Starts and stops the intro animation.
   */
  private playIntroAnimation(): void {
    this.showIntroAnimation.set(true);

    setTimeout(() => {
      this.showIntroAnimation.set(false);
    }, 2000);
  }
}