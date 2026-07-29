import { Component } from '@angular/core';
import { LogoDark } from '../../shared/components/logo-dark/logo-dark';
import { AuthService } from '../../shared/services/auth-service';




@Component({
  selector: 'app-header',
  imports: [LogoDark],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  constructor(private AuthService: AuthService) {}

  logOut() {
  this.AuthService.logout();
  }
}
