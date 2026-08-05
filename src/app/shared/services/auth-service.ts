import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

/**
 * Injectable service singleton orchestrating the global authentication lifecycle and remote authorization handshakes.
 * Manages session states, network mutations via the Supabase client layer, and programmatic view routing transitions.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /**
   * Private access property caching the instantiated Supabase client node for secure backend network transactions.
   */
  private dB: SupabaseClient;

  /**
   * Stateful binary flag tracking the local authorization matrix.
   * Determines structural access rights across the active application session.
   */
  isAuthenticated: boolean = false;

  /**
   * Instantiates the service context, establishes the secure backend client connection mapping,
   * and injects core routing dependencies for application state transitions.
   *
   * @param {Router} router - Core Angular routing layer for programmatic navigation dispatch.
   */
  constructor(private router: Router) {
    this.dB = createClient(environment.apiUrl, environment.apiKey);

    // Keep local auth flag in sync with Supabase auth state to avoid
    // false negatives during initial reload/login restoration.
    this.dB.auth.onAuthStateChange((event, session) => {
      this.isAuthenticated = !!session?.user;
    });
  }

  /**
   * Initiates an asynchronous network mutation to register a new user entity within the remote authorization backend.
   * Evaluates payload criteria and intercepts raw transaction faults during the secure handshake.
   *
   * @param {string} email - String literal payload containing the validated electronic mail address.
   * @param {string} password - String literal payload containing the explicit security access token.
   * @returns {Promise<{data: any, error: any}>} Deferred promise resolving the remote transaction footprint or error vectors.
   */
  async signUp(email: string, password: string) {
    const { data, error } = await this.dB.auth.signUp({ email, password });
    if (error) {
      console.error('Error occurred while signing up:', error);
    }
    return { data, error };
  }

  /**
   * Executes an asynchronous authorization handshake against the backend database using explicit credential syntax.
   * Mutates local state flags and dispatches programmatic routing signals upon successful validation.
   *
   * @param {string} email - String literal payload caching the user's registered identification handle.
   * @param {string} password - String literal payload caching the corresponding security token.
   * @returns {Promise<{data: any, error: any}>} Deferred promise resolving the active session payload or fault matrix.
   */
  async login(email: string, password: string) {
    const { data, error } = await this.dB.auth.signInWithPassword({ email, password });
    if (error) {
      this.isAuthenticated = false;
      console.error('Error occurred while signing in:', error);
    } else {
      this.isAuthenticated = true;
      this.router.navigate(['']);
    }
    return { data, error };
  }

  /**
   * Dispatches an explicit network termination signal to purge the active remote authorization session.
   * Resets local binary state matrices and dynamically yields the viewport back to the baseline login interface.
   *
   * @returns {Promise<void>} Deferred promise resolving upon the completion of the termination sequence.
   */
  async logout() {
    const { error } = await this.dB.auth.signOut();
    this.isAuthenticated = false;
    if (error) {
      console.error('Error occurred while signing out:', error);
    }
    this.router.navigate(['/login']);
  }

  /**
   * Asynchronously evaluates the current session footprint against the remote authorization matrix to retrieve the active user payload.
   * Intercepts and safely absorbs missing session faults to prevent cascading execution failures across the application tree.
   *
   * @returns {Promise<any | null>} Deferred promise resolving the active user entity payload, or null if validation fails.
   */
  async getUser() {
    try {
      const { data, error } = await this.dB.auth.getUser();
      if (error) {
        if (error.message?.includes('Auth session missing') || error.status === 400) {
          return null;
        }

        console.error('Error occurred while getting current user:', error);
        return null;
      }

      return data.user;
    } catch {
      return null;
    }
  }

  /**
   * Evaluates the local binary state flag mapping the session context.
   * Falls back to a localized network validation cycle if the local state cache evaluates to false, ensuring robust session continuity.
   *
   * @returns {Promise<boolean>} Deferred promise resolving to a binary true if a valid session footprint exists, false otherwise.
   */
  async isLoggedIn(): Promise<boolean> {
    if (this.isAuthenticated) return true;

    // Use getSession() which more reliably reports an existing session
    // during app start / page reload compared to getUser().
    try {
      const { data, error } = await this.dB.auth.getSession();
      if (error) {
        console.error('Error checking session:', error);
        return false;
      }

      const hasUser = !!data?.session?.user;
      this.isAuthenticated = hasUser;
      return hasUser;
    } catch (e) {
      return false;
    }
  }

  /**
   * Programmatically bypasses strict network authorization parameters to grant immediate local session validity.
   * Used to facilitate restricted generic application access without explicit backend handshake protocols.
   */
  guestLogin() {
    this.isAuthenticated = true;
  }
}
