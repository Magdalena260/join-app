import { Component, signal, OnInit } from '@angular/core';
import { Greeting } from './greeting/greeting';
import { Cards } from './cards/cards';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [Greeting, Cards],
  templateUrl: './summary.html',
  styleUrl: './summary.scss',
})

export class Summary implements OnInit{

    /**
   * Reactive signal controlling the visibility state of the mobile-only intro greeting animation.
   */
  protected readonly showIntroAnimation = signal<boolean>(false);

  /**
   * Executed on component initialization. Checks client environment specifications 
   * to trigger a single-session responsive onboarding animation for mobile form factors.
   */
  public ngOnInit(): void {
    const isMobile = window.matchMedia('(max-width: 992px)').matches;
    const introAlreadyShown = window.name.includes('introAnimationShown=true');

    if (!isMobile || introAlreadyShown) {
      return;
    }

    window.name = `${window.name};introAnimationShown=true`;
    this.showIntroAnimation.set(true);

    const animationDurationMs = 2000;
    setTimeout(() => {
      this.showIntroAnimation.set(false);
    }, animationDurationMs);
  }
}