import { Component } from '@angular/core';
import { LogoDark } from '../../shared/components/logo-dark/logo-dark';
import { ProfileIcon } from '../../shared/components/profile-icon/profile-icon';
import { AuthService } from '../../shared/services/auth-service';

@Component({
  selector: 'app-header',
  imports: [LogoDark, ProfileIcon],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class Header {
  constructor(private authService: AuthService) {}

  logOut() {
    this.authService.logout();
  }
}
