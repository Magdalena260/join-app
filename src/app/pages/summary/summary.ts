import { Component } from '@angular/core';
import { Greeting } from './greeting/greeting';
import { Cards } from './cards/cards';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [Greeting, Cards],
  templateUrl: './summary.html',
  styleUrl: './summary.scss',
})

export class Summary {}