import { Component } from '@angular/core';

@Component({
  selector: 'app-greeting',
  imports: [],
  templateUrl: './greeting.html',
  styleUrl: './greeting.scss',
})
export class Greeting {

  /** Returns a time-based greeting for the current hour. */ 
  get greetingGetter(): string {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return 'Good morning!';
    if (hour >= 11 && hour < 17) return 'Good day!';
    if (hour >= 17 && hour < 22) return 'Good evening!';
    return 'Good night!';
  }
}
