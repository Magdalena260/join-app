import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
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
export class Header {
  /**
   * Instantiates the component wrapper context and injects core routing and authentication services.
   *
   * @param {AuthService} authService - Core authentication layer managing active user sessions.
   * @param {Router} router - Core Angular routing layer for application state transitions.
   */
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  /**
   * Triggers the explicit termination sequence for the active user session.
   * Purges authorization states via the authentication service and programmatically redirects
   * the view context back to the baseline login interface.
   */
  logOut() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
