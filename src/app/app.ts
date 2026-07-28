import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { SidebarComponent } from './layout/sidebar/sidebar';
import { Greeting } from './pages/summary/greeting/greeting';
import { RotateScreen } from './shared/components/rotate-screen/rotate-screen';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, Header, Greeting, RotateScreen],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App implements OnInit {
  protected readonly title = signal('join-app');

  showIntroAnimation = signal(false);

  /** Shows the mobile intro animation once per browser tab session. */
  ngOnInit(): void {
    const isMobile = window.matchMedia('(max-width: 992px)').matches;
    const introAlreadyShown = window.name.includes('introAnimationShown=true');

    if (!isMobile || introAlreadyShown) {
      return;
    }

    window.name = `${window.name};introAnimationShown=true`;
    this.showIntroAnimation.set(true);

    setTimeout(() => {
      this.showIntroAnimation.set(false);
    }, 2000);
  }
}
