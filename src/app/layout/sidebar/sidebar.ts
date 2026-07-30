import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LogoWhite } from '../../shared/components/logo-white/logo-white';
import { AuthService } from '../../shared/services/auth-service';


/**
 * Component managing the persistent lateral navigation matrix.
 * Handles routing dispatch links and structural branding integration
 * across the application's primary viewport states.
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, LogoWhite],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
})
export class SidebarComponent {
  authService = inject(AuthService);
}