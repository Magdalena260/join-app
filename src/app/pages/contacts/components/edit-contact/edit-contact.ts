import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UIContact } from '../contacts-list/contacts-list';

/**
 * Component handling the user interface and input validation for modifying existing contact records.
 * Synchronizes updated data structures back to outer orchestrators upon successful validation.
 */
@Component({
  selector: 'app-edit-contact',
  standalone: true,
  imports: [ReactiveFormsModule], 
  templateUrl: './edit-contact.html',
  styleUrls: ['./edit-contact.scss'],
})
export class EditContactComponent {
  /**
   * Local copy of the contact being edited.
   * Keeps track of unsaved changes before saving.
   */
  public editingContact: UIContact | null = null;

  /** Internal backing store holding the original contact reference. */
  private _contact: UIContact | null = null;

  /**
   * Reactive Form definition matching the HTML formControlNames and patterns from Magdalena/addNewContact.
   */
  public editContactForm = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-ZäöüÄÖÜß]{2,}\s[a-zA-ZäöüÄÖÜß]{2,}.*$/)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|de)$/)
    ]),
    telephone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\+49\d+$/)
    ])
  });

  /**
   * The contact object currently selected for editing.
   * Fulfills User Story 4 (opens form with pre-filled data).
   * Uses setter to create a local copy when the input changes.
   */
  @Input()
  set contact(value: UIContact | null) {
    this._contact = value;
    this.editingContact = value ? { ...value } : null;

    if (this.editingContact) {
      this.editContactForm.patchValue({
        name: this.editingContact.name || '',
        email: this.editingContact.email || '',
        telephone: this.editingContact.telephone || ''
      });
      this.editContactForm.markAsPristine();
      this.editContactForm.markAsUntouched();
    } else {
      this.editContactForm.reset();
    }
  }

  /**
   * Returns the original contact object reference passed to this component.
   * 
   * @returns {UIContact | null} The raw contact payload or null if unassigned.
   */
  get contact(): UIContact | null {
    return this._contact;
  }

  /**
   * Emits an event to notify the parent component to close the edit overlay.
   */
  @Output() public closeOverlay = new EventEmitter<void>();

  /**
   * Emits the updated contact object back to the parent component for saving.
   */
  @Output() public saveContact = new EventEmitter<UIContact>();

  /**
   * Emits when the user requests to delete the current contact.
   */
  @Output() public deleteContact = new EventEmitter<UIContact>();

  /**
   * Triggers the event to close the edit contact overlay/view.
   */
  public onCloseOverlay(): void {
    this.closeOverlay.emit();
  }

  /**
   * Closes the overlay only when the backdrop itself is clicked.
   * 
   * @param {MouseEvent} event - Native mouse click event intercept context.
   */
  public onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onCloseOverlay();
    }
  }

  /**
   * Dispatches the updated contact data to the parent component to trigger the backend save.
   * Fulfills User Story 4 (submitting modified values).
   */
  public onSaveContact(): void {
    if (this.editContactForm.valid && this.editingContact) {
      const formValues = this.editContactForm.value;

      this.editingContact.name = formValues.name!;
      this.editingContact.email = formValues.email!;
      this.editingContact.telephone = formValues.telephone!;

      this.saveContact.emit(this.editingContact);
    } else {
      this.editContactForm.markAllAsTouched();
    }
  }

  /**
   * Triggers the delete event for the currently edited contact.
   * Fulfills User Story 4 (deleting option).
   */
  public onDeleteContact(): void {
    if (this.editingContact) {
      this.deleteContact.emit(this.editingContact);
    }
  }
}
