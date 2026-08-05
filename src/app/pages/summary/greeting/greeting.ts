import { Component, OnInit, signal, inject } from '@angular/core';
import { AuthService } from '../../../shared/services/auth-service';
import { contactsService } from '../../../shared/services/contacts-service';

@Component({
  selector: 'app-greeting',
  standalone: true,
  templateUrl: './greeting.html',
  styleUrl: './greeting.scss',
})
export class Greeting implements OnInit {
  private authService = inject(AuthService);
  private contactDatabase = inject(contactsService);

  userName = signal<string>('');

  /** Loads the logged-in user's contact name for the greeting. */
  async ngOnInit(): Promise<void> {
    if (!this.authService.isAuthenticated) {
      return;
    }

    const user = await this.authService.getUser();

    if (!user?.email) {
      return;
    }

    await this.contactDatabase.getContacts();

    const contact = this.contactDatabase
      .contacts()
      .find((contact) => contact.email === user.email);

    if (!contact) {
      return;
    }

    this.userName.set(`${contact.firstname} ${contact.lastname}`);
  }

  /** Returns a time-based greeting for the current hour. */
  get greetingGetter(): string {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 11) return 'Good morning!';
    if (hour >= 11 && hour < 17) return 'Good day!';
    if (hour >= 17 && hour < 22) return 'Good evening!';

    return 'Good night!';
  }

  /** Returns a time-based greeting for the current hour. */
  get greetingGetterLoggedIn(): string {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 11) return 'Good morning';
    if (hour >= 11 && hour < 17) return 'Good day';
    if (hour >= 17 && hour < 22) return 'Good evening';

    return 'Good night!';
  }
}
