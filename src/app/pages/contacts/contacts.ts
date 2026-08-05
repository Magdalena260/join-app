import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { Contact } from '../../shared/interfaces/contact';
import { contactsService } from '../../shared/services/contacts-service';
import { ContactsDetailComponent } from './components/contacts-detail/contacts-detail';
import { ContactList, UIContact } from './components/contacts-list/contacts-list';
import { EditContactComponent } from './components/edit-contact/edit-contact';

/**
 * Component responsible for orchestrating the contacts management view.
 * Coordinates data flows between the contact list, detailed information view,
 * and editing overlays using reactive state signals.
 */
@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [CommonModule, ContactList, ContactsDetailComponent, EditContactComponent],
  templateUrl: './contacts.html',
  styleUrls: ['./contacts.scss'],
})
export class Contacts implements OnInit, OnDestroy {
  private contactsService = inject(contactsService);
  private rotateScreenElement: HTMLElement | null = null;
  private rotateScreenPreviousDisplay = '';

  /**
   * Central signal holding the currently active contact for the whole page.
   * Strictly typed to UIContact to ensure data integrity between list and detail views.
   */
  public activeContact = signal<UIContact | null>(null);

  /** Signal controlling the visibility state of the edit contact component/overlay. */
  public isEditContactOpen = signal<boolean>(false);

  /**
   * Hides the global rotate-screen overlay while the contacts view is active.
   */
  public ngOnInit(): void {
    this.toggleGlobalRotateScreen(false);
  }

  /**
   * Restores the original rotate-screen visibility when leaving contacts.
   */
  public ngOnDestroy(): void {
    this.toggleGlobalRotateScreen(true);
  }

  /**
   * Updates the central active contact when a selection event occurs.
   * Fulfills User Story 2 (handling contact selection).
   * @param {UIContact} contact - The transformed contact object from the list.
   * @returns {void}
   */
  public handleContactSelection(contact: UIContact): void {
    this.activeContact.set(contact);
  }

  /**
   * Sets the active contact and opens the edit contact view/overlay.
   * Fulfills User Story 4 (initiating contact editing).
   * @param {UIContact} contact - The contact object to be edited.
   * @returns {void}
   */
  public openEditContact(contact: UIContact): void {
    this.activeContact.set(contact);
    this.isEditContactOpen.set(true);
  }

  /**
   * Closes the edit contact view/overlay.
   * @returns {void}
   */
  public closeEditContact(): void {
    this.isEditContactOpen.set(false);
  }

  /**
   * Deletes a contact from the database using the Contacts service and clears the active selection.
   * Fulfills User Story 4 (The option 'Delete' removes the contact permanently).
   * @param {UIContact} contact - The contact object requested for deletion.
   * @returns {Promise<void>}
   */
  public async handleDeleteContact(contact: UIContact): Promise<void> {
    if (!contact || !contact.id) {
      return;
    }

    await this.contactsService.deleteContact(contact.id);

    this.activeContact.set(null);
    this.isEditContactOpen.set(false);
  }

  /**
   * Updates an edited contact in the database and refreshes the current active view.
   * Fulfills User Story 4 (Saving the adapted contact data).
   * @param {UIContact} updatedContact - The contact object with modified values.
   * @returns {Promise<void>}
   */
  public async handleContactUpdate(updatedContact: UIContact): Promise<void> {
  if (!updatedContact || !updatedContact.id) {
    return;
  }

  const nameParts = updatedContact.name ? updatedContact.name.trim().split(/\s+/) : [];
  const extractedFirstname = nameParts[0] || '';
  const extractedLastname = nameParts.slice(1).join(' ');
  const contactPayload: Contact = {
    id: updatedContact.id,
    firstname: extractedFirstname || updatedContact.firstname || '',
    lastname: extractedLastname || updatedContact.lastname || '',
    email: updatedContact.email,
    telephone: updatedContact.telephone,
  };

  await this.contactsService.updateContact(contactPayload);

  
  this.activeContact.set({
    ...updatedContact,
    firstname: contactPayload.firstname,
    lastname: contactPayload.lastname,
    name: `${contactPayload.firstname} ${contactPayload.lastname}`.trim()
  });

  this.closeEditContact();
  }

  /**
   * Resets the active contact to null to return to the list view on mobile.
   * 
   * @param {ContactList} listComponent - The child contact list component instance to clear its local selection.
   * @returns {void}
   */
  public handleBackToList(listComponent: ContactList): void {
    this.activeContact.set(null);
    
    if (listComponent) {
      listComponent.selectedContact.set(null); 
    }
  }

  /**
   * Temporarily toggles the root rotate-screen host element.
   * Keeps changes local to this route by restoring the previous inline style.
   */
  private toggleGlobalRotateScreen(shouldShow: boolean): void {
    if (typeof document === 'undefined') {
      return;
    }

    const rotateScreenHost = document.querySelector('app-rotate-screen') as HTMLElement | null;
    if (!rotateScreenHost) {
      return;
    }

    if (!this.rotateScreenElement) {
      this.rotateScreenElement = rotateScreenHost;
      this.rotateScreenPreviousDisplay = rotateScreenHost.style.display;
    }

    if (shouldShow) {
      this.rotateScreenElement.style.display = this.rotateScreenPreviousDisplay;
      return;
    }

    this.rotateScreenElement.style.display = 'none';
  }
}
