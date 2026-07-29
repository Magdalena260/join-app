import { Component } from '@angular/core';
import { LogoDark } from '../../shared/components/logo-dark/logo-dark';
import { ProfileIcon } from '../../shared/components/profile-icon/profile-icon';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [LogoDark, ProfileIcon, RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class Header {
  constructor(private authService: AuthService, private router: Router) {}

  logOut() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
