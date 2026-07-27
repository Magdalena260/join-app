import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { SidebarComponent } from './layout/sidebar/sidebar';
import { RotateScreen } from './shared/components/rotate-screen/rotate-screen';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, Header, RotateScreen],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  protected readonly title = signal('join-app');
}
