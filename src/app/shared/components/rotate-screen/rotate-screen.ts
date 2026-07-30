import { Component } from '@angular/core';

/**
 * Component managing the viewport orientation constraints and structural overlay matrices.
 * Evaluates unfavorable device aspect ratios to render a persistent visual directive,
 * prompting the user to mutate the physical hardware orientation for optimal layout execution.
 */
@Component({
  selector: 'app-rotate-screen',
  standalone: true,
  imports: [],
  templateUrl: './rotate-screen.html',
  styleUrl: './rotate-screen.scss',
})
export class RotateScreen {}
