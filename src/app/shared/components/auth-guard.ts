import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { AuthService } from '../services/auth-service';

/**
 * Injectable routing guard orchestrating the global execution authorization matrix.
 * Intercepts programmatic view transitions to evaluate active session footprints and
 * enforces structural access constraints across the application state tree.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  /**
   * Instantiates the guard context, injecting core authorization dependencies and
   * routing layers to facilitate conditional network access and dynamic layout mutations.
   *
   * @param {AuthService} authService - Service singleton evaluating the active session vectors and backend authorization handshakes.
   * @param {Router} router - Core Angular routing layer for programmatic navigation dispatch and UrlTree synthesis.
   */
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  /**
   * Asynchronously evaluates the active user session matrix against the targeted structural route boundary.
   * Permits the programmatic view execution if a valid session footprint is detected,
   * otherwise synthesizes a redirection tree to yield the viewport to the baseline authentication interface.
   *
   * @param {ActivatedRouteSnapshot} route - The contextual snapshot matrix of the requested structural route endpoint.
   * @param {RouterStateSnapshot} state - The sequential snapshot footprint of the overarching application routing state.
   * @returns {Promise<boolean | UrlTree>} Deferred promise resolving to a binary execution flag, or a localized redirection UrlTree.
   */
  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<boolean | UrlTree> {
    if (this.authService.isAuthenticated || (await this.authService.isLoggedIn())) {
      return true;
    }

    console.log('User is not logged in. Redirecting to login page.');
    return this.router.createUrlTree(['/login']);
  }
}
