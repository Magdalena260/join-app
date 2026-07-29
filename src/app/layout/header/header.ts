import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogoDark } from '../../shared/components/logo-dark/logo-dark';
import { ProfileIcon } from '../../shared/components/profile-icon/profile-icon';
import { AuthService } from '../../shared/services/auth-service';

@Component({
  selector: 'app-header',
  imports: [LogoDark, ProfileIcon],
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class Header implements OnInit, OnDestroy {
  userInitials: string = 'G';
  private authSubscription?: any;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit() {
    this.loadUserInitials();

    const supabase = (this.authService as any).dB; 
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange((event: string, session: any) => {
        this.loadUserInitials();
      });
      this.authSubscription = data.subscription;
    }
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  async loadUserInitials() {
    const user = await this.authService.getUser();

    setTimeout(() => {
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
    }, 0);
  }

  private getInitialsFromName(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2 && parts[0] && parts[parts.length - 1]) {
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  logOut() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
