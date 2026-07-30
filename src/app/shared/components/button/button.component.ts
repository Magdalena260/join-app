import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';

/**
 * Component managing the structural and interaction boundaries of a reusable UI button primitive.
 * Evaluates reactive input signals to synthesize dynamic styling matrices, contextual variants,
 * and controlled execution flows for interaction events.
 */
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  host: {
    '[class.full-width-host]': 'isFullWidthClass()',
  },
})
export class ButtonComponent {
  /**
   * Required input signal caching the lexical payload to be rendered within the primary button boundary.
   */
  text = input.required<string>();

  /**
   * Input signal evaluating the designated stylistic classification.
   * Determines the color matrix and visual hierarchy applied to the native DOM node.
   */
  variant = input<'primary' | 'secondary' | 'outline'>('primary');

  /**
   * Input signal evaluating the dimensional constraints and spatial padding vectors of the component boundary.
   */
  size = input<'sm' | 'md' | 'lg'>('md');

  /**
   * Input signal establishing the horizontal layout flow policy.
   * Controls whether the boundary wraps its content or aggressively expands to fill the parent layout matrix.
   */
  width = input<'auto' | 'full'>('auto');

  /**
   * Input signal defining the native semantic execution behavior of the underlying HTML button node
   * within broader form architecture contexts.
   */
  buttonType = input<'button' | 'submit' | 'reset'>('button');

  /**
   * Binary input signal locking the component interaction state.
   * Suppresses pointer events and visualizes an inert state constraint when evaluated to true.
   */
  disabled = input<boolean>(false);

  /**
   * Binary input signal determining the active processing state.
   * Suppresses standard interaction flows and enables active operation visualizers when evaluated to true.
   */
  loading = input<boolean>(false);

  /**
   * Input signal evaluating the typographic stroke density mapped to the embedded lexical payload.
   */
  fontWeight = input<'regular' | 'bold'>('bold');

  /**
   * Binary input signal mapped for explicit full-width constraint overrides.
   * Merged dynamically with the primary structural width property via reactive computation.
   */
  isFullWidth = input<boolean>(false);

  /**
   * Reactive computed signal synthesizing the horizontal structural constraints.
   * Evaluates the layout dimension stream against targeted binary flags to output a unified structural class binding.
   */
  isFullWidthClass = computed(() => this.width() === 'full' || this.isFullWidth());

  /**
   * Output signal dispatching a targeted execution event up the component hierarchy upon successful interaction resolution.
   */
  btnClick = output<void>();

  /**
   * Intercepts native pointer interaction events mapped to the component boundary.
   * Evaluates the local operational constraints (disabled and processing state vectors) before delegating the execution payload.
   */
  onButtonClick(): void {
    if (!this.disabled() && !this.loading()) {
      this.btnClick.emit();
    }
  }
}
