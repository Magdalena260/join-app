import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private dB: SupabaseClient;
  isAuthenticated: boolean = false;

  constructor(private router: Router) {
    this.dB = createClient(environment.apiUrl, environment.apiKey);
  }

  async signUp(email: string, password: string) {
    const { data, error } = await this.dB.auth.signUp({ email, password });
    if (error) {
      console.error('Error occurred while signing up:', error);
    }
    return { data, error };
  }

  async login(email: string, password: string) {
    const { data, error } = await this.dB.auth.signInWithPassword({ email, password });
    if (error) {
      this.isAuthenticated = false;
      console.error('Error occurred while signing in:', error);
    } else {
      this.isAuthenticated = true;
    }
    return { data, error };
  }

  async logout() {
    const { error } = await this.dB.auth.signOut();
    this.isAuthenticated = false;
    if (error) {
      console.error('Error occurred while signing out:', error);
    }
    this.router.navigate(['/login']);
  }

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

  async isLoggedIn(): Promise<boolean> {
    if (this.isAuthenticated) {
      return true;
    }

    const user = await this.getUser();
    return !!user;
  }

  guestLogin() {
    this.isAuthenticated = true;
  }
}
