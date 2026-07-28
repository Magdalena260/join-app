import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticated: boolean = false;

  login(): void {
      // Hier würde normalerweise die tatsächliche Authentifizierungslogik stehen
      this.isAuthenticated = true;
    }

    logout(): void {
      this.isAuthenticated = false;
    }

    isLoggedIn(): boolean {
      return this.isAuthenticated;
    }
}
