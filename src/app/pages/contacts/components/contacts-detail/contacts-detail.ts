import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UIContact } from '../contacts-list/contacts-list';

/**
 * Component responsible for displaying detailed information about a selected contact.
 * Manages contextual mobile actions and dispatches event streams for updating or 
 * removing records within higher-level orchestrator views.
 */
@Component({
  selector: 'app-contacts-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contacts-detail.html',
  styleUrls: ['./contacts-detail.scss']
})
export class ContactsDetailComponent {
  
  /**
   * The currently active contact to display in detail view.
   * Fulfills User Story 2 (viewing details).
   */
  @Input() public contact: UIContact | null = null;

  /** 
   * Emits when the user requests to edit the current contact.
   * @type {EventEmitter<UIContact>} 
   */
  @Output() public edit = new EventEmitter<UIContact>();

  /** 
   * Emits when the user requests to delete the current contact.
   * @type {EventEmitter<UIContact>} 
   */
  @Output() public delete = new EventEmitter<UIContact>();

  /** 
   * Emits when the mobile back button is pressed to close the details.
   * @type {EventEmitter<void>} 
   */
  @Output() public close = new EventEmitter<void>();

  /** 
   * State flag determining whether the contextual responsive action sheet or mobile overlay is visible. 
   */
  public isMobileMenuOpen = false;

  /** Toggles the visibility of the mobile edit/delete menu. */
  public toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  /**
   * Triggers the edit event for the currently viewed contact.
   * Fulfills User Story 4 (editing option).
   * @returns {void}
   */
  public onEditContact(): void {
    if (this.contact) {
      this.edit.emit(this.contact);
    }
  }

  /**
   * Triggers the delete event for the currently viewed contact.
   * Fulfills User Story 4 (deleting option).
   * @returns {void}
   */
  public onDeleteContact(): void {
    if (this.contact) {
      this.delete.emit(this.contact);
    }
  }

  /**
   * Dispatches an empty notification signal to trigger list navigation behaviors on mobile layouts.
   * @returns {void}
   */
  public onCloseDetail(): void {
    this.close.emit();
  }
}
