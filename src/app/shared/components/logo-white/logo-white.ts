import { Component } from '@angular/core';

/**
 * Component managing the structural binding and visual rendering of the alternate application branding.
 * Encapsulates the light-themed vector matrix to ensure deterministic brand consistency across dark or contrasted layout hierarchies.
 */
@Component({
  selector: 'app-logo-white',
  standalone: true,
  imports: [],
  templateUrl: './logo-white.html',
  styleUrl: './logo-white.scss',
})
export class LogoWhite {}
