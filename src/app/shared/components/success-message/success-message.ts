import { Component, Input } from '@angular/core';

/**
 * Component managing the structural binding and visual rendering of transient success notification overlays.
 * Encapsulates contextual confirmation matrices to provide deterministic feedback state visualizations
 * following successful network or database execution sequences.
 */
@Component({
  selector: 'app-success-message',
  imports: [],
  templateUrl: './success-message.html',
  styleUrl: './success-message.scss',
})
export class SuccessMessage {
  /**
   * Externally bound string literal payload injected from the parent view hierarchy.
   * Establishes the precise lexical notification context rendered within the component's structural boundary.
   */
  @Input() message = '';
}
