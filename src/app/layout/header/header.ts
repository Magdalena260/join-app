import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { LogoDark } from '../../shared/components/logo-dark/logo-dark';
import { ProfileIcon } from '../../shared/components/profile-icon/profile-icon';
import { AuthService } from '../../shared/services/auth-service';

/**
 * Component managing the global application header interface.
 * Handles top-level navigation, user branding elements, and dispatches explicit
 * authentication termination signals across the active session state.
 */
@Component({
  selector: 'app-header',
  imports: [LogoDark, ProfileIcon, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class Header implements OnInit, OnDestroy {
  /**
   * Caches the evaluated initials of the authenticated user.
   * Defaults to 'G' for guest accounts or unauthenticated states.
   */
  public userInitials: string = 'G';
  public isLoggedIn: boolean = false;

  /**
   * Subscription references tracking authentication and routing state streams.
   * Kept in memory to prevent memory leaks upon component destruction.
   * @private
   */
  private authSubscription?: any;
  private routerSubscription?: Subscription;

  /**
   * Instantiates the header component context.
   * 
   * @param {AuthService} authService - Service managing authentication requests and session states.
   * @param {Router} router - Core Angular routing layer for application state transitions.
   * @param {ChangeDetectorRef} cdr - Service to manually trigger change detection loops for asynchronously loaded profile data.
   */
  constructor(
    private authService: AuthService, 
    private router: Router,
    private cdr: ChangeDetectorRef 
  ) {}

  /**
   * Lifecycle hook triggered instantly upon component initialization.
   * Resolves baseline user footprints and binds persistent hooks to capture cross-session auth changes.
   */
  public ngOnInit(): void {
    this.loadUserInitials();
    const supabase = (this.authService as any).dB; 
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange(() => {
        this.loadUserInitials();
      });
      this.authSubscription = data.subscription;
    }

    this.routerSubscription = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadUserInitials();
      });
  }

  /**
   * Lifecycle hook triggered when the component is destroyed.
   * Unsubscribes from active handshake and routing streams to purge resources cleanly.
   */
  public ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  /**
   * Asynchronously pulls raw session records from the authentication layer.
   * Defers visual evaluation to synchronize character signals and safely flush state modifications.
   * 
   * @returns {Promise<void>} A promise that resolves when the user initials have been evaluated and view state is forced.
   */
  public async loadUserInitials(): Promise<void> {
    const user = await this.authService.getUser();
    this.isLoggedIn = await this.authService.isLoggedIn();

    if (!user) {
      this.userInitials = 'G';
    } else {
      const fullName = user.user_metadata?.['full_name'] || user.user_metadata?.['name'];
      if (fullName) {
        this.userInitials = this.getInitialsFromName(fullName);
      } else if (user.email) {
        this.userInitials = user.email.substring(0, 2).toUpperCase();
      }
    }
    
    this.cdr.detectChanges(); 
  }

  /**
   * Extracts exactly two identifying initial characters from a given full name string.
   * Falls back to the first two leading letters of the string if name tokens cannot be securely split.
   * 
   * @param {string} name - The raw full name string evaluated from database user meta streams.
   * @returns {string} A two-character capitalized string representing the initials.
   * @private
   */
  private getInitialsFromName(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2 && parts[0] && parts[parts.length - 1]) {
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  /**
   * Destroys the current active session state and redirects browser navigation parameters back to login paths.
   */
  public logOut(): void {
    this.authService.logout();
  }
}
