import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Header } from './layout/header/header';
import { SidebarComponent } from './layout/sidebar/sidebar';

/**
 * Root application component responsible for managing global layout structures.
 * Dynamically switches between simple authentication viewports and complex 
 * dashboard layouts with navigation bars based on active route streams.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, Header],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  /**
   * Injecting the Angular router to monitor active routes.
   * 
   * @private
   */
  private router = inject(Router);

  /**
   * Application title property wrapped in a reactive signal.
   */
  protected readonly title = signal('join-app');

  /**
   * Reactive signal holding the verified final destination URL path.
   * Driven by localized stream monitoring inside the component initializer.
   * 
   * @private
   */
  private currentUrl = signal<string>('');

  /**
   * Subscribes to synchronous router event lifecycle channels.
   * Filters specifically for completed navigation targets to populate the tracking matrix.
   */
  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentUrl.set(event.urlAfterRedirects || event.url);
    });
  }

  /**
   * Computed signal evaluating if the active route is a standalone authentication or legal page.
   * Returns true if the viewport should suppress global sidebar and header layout trees.
   */
  protected readonly isAuthPage = computed<boolean>(() => {
    const url = this.currentUrl();
    
    if (!url) return true;

    return (
      url === '/' ||
      url.startsWith('/login') ||
      url.startsWith('/sign-up') ||
      url.startsWith('/privacy-policy') ||
      url.startsWith('/legal-notice')
    );
  });
}
