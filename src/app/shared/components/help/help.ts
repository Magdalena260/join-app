import { Location } from '@angular/common';
import { Component } from '@angular/core';

/**
 * Component managing the static application help page.
 * Displays user guides, kanban board instructions, and provides
 * cross-session historical navigation capabilities.
 */
@Component({
  selector: 'app-help',
  standalone: true,
  imports: [],
  templateUrl: './help.html',
  styleUrls: ['./help.scss']
})
export class Help {
  
  /**
   * Instantiates the help component context.
   * 
   * @param {Location} location - Core Angular location service used to interact with the browser's history stack.
   */
  constructor(private location: Location) {}

  /**
   * Navigates the application history backward by exactly one step.
   * Restores the previous view context seamlessly when the back chevron is triggered.
   */
  public goBack(): void {
    this.location.back(); 
  }
}
