import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
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
   * Computed signal evaluating if the active route is a standalone authentication or legal page.
   * Returns true if the viewport should suppress global sidebar and header layout trees.
   */
  protected readonly isAuthPage = computed<boolean>(() => {
    const currentUrl = this.router.url;
    return (
      currentUrl === '/' ||
      currentUrl.includes('/login') ||
      currentUrl.includes('/sign-up') ||
      currentUrl.includes('/privacy-policy') ||
      currentUrl.includes('/legal-notice')
    );
  });
}
