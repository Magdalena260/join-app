import { CommonModule } from '@angular/common';
import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    OnInit,
    Output,
    ViewChild,
    computed,
    effect,
    inject,
    signal,
} from '@angular/core';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { Contact } from '../../../../shared/interfaces/contact';
import { contactsService } from '../../../../shared/services/contacts-service';
import { ContactAddNewContactDialog } from '../contact-add-new-contact-dialog/contact-add-new-contact-dialog';

/**
 * Extended contact interface enriched with visual layout properties 
 * required exclusively by UI presentation layers.
 */
export interface UIContact extends Contact {
  name: string;
  initials: string;
  avatarColor: string;
}

/**
 * Dictionary blueprint for clustering UI-ready contacts under 
 * matching single-character alphabetical headlines.
 */
interface ContactGroup {
  letter: string;
  contacts: UIContact[];
}

/**
 * Component managing the rendering and grouping of user contact records.
 * Orchestrates real-time cache sync streams and provides event bindings for 
 * sub-overlay interactions and selection highlights.
 */
@Component({
  selector: 'app-contacts-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent, ContactAddNewContactDialog],
  templateUrl: './contacts-list.html',
  styleUrls: ['./contacts-list.scss'],
})
export class ContactList implements OnInit {
  /** Reference injected service managing shared contact entities and DB bridges. */
  public contactsService = inject(contactsService);
  
  /** Injected Angular ChangeDetectorRef to force template evaluation ticks on micro-tasks. */
  private cdr = inject(ChangeDetectorRef);
  
  /** Signal capturing the currently highlighted or viewed entity in the list view. */
  public selectedContact = signal<UIContact | null>(null);

  /** Caches temporary unique record keys to auto-trigger item selections upon asynchronous DB writes. */
  private pendingCreatedContactId: number | null = null;

  /** Reference hook mapping the modular sub-overlay used for creating new entries. */
  @ViewChild(ContactAddNewContactDialog)
  public addContactDialog!: ContactAddNewContactDialog;

  /**
   * Initializes the reactive execution loop wrapper.
   * Intercepts updates to local collection limits to auto-focus freshly generated entities.
   */
  constructor() {
    effect(() => {
      const rawContacts = this.contactsService.contacts();
      
      if (this.pendingCreatedContactId !== null && rawContacts && rawContacts.length > 0) {
        const found = rawContacts.find(c => c.id === this.pendingCreatedContactId);
        if (found) {
          setTimeout(() => {
            this.selectContact(found);
            this.pendingCreatedContactId = null;
          }, 0);
        }
      }
    });
  }

  /**
   * Triggers the internal presentation state change on the dialog child layout node.
   */
  public openAddContactDialog(): void {
    this.addContactDialog.openDialog();
  }

  /** Emits the newly selected UI-ready contact wrapper up toward outer orchestrators. */
  @Output() public contactSelected = new EventEmitter<UIContact>();

  /** Array of hex and custom style property declarations used to colorize avatars. */
  public availableColors: string[] = [
    'var(--clr-user-tangerine)',
    'var(--clr-user-flamingo)',
    'var(--clr-user-iris)',
    'var(--clr-user-amethyst)',
    'var(--clr-user-sky)',
    'var(--clr-user-mint)',
    'var(--clr-user-salmon)',
    'var(--clr-user-apricot)',
    'var(--clr-user-fuchsia)',
    'var(--clr-user-sunflower)',
    'var(--clr-user-cobalt)',
    'var(--clr-user-lime)',
    'var(--clr-user-lemon)',
    'var(--clr-user-cherry)',
    'var(--clr-user-marigold)',
  ];

  /**
   * Intercepts successful creation signals to schedule an automated focus action.
   * 
   * @param {any} contact - The newly committed contact payload from dialog events.
   */
  public handleNewContactCreated(contact: any): void {
    if (contact && typeof contact.id === 'number') {
      this.pendingCreatedContactId = contact.id;
    }
  }

  /**
   * Computed signal that automatically groups and sorts contacts alphabetically.
   * Fulfills User Story 1 (alphabetical sorting and section splitting).
   */
  public groupedContacts = computed<ContactGroup[]>(() => {
    const rawContacts = this.contactsService.contacts();
    if (!rawContacts || rawContacts.length === 0) return [];

    const sorted = [...rawContacts].sort((a, b) => a.firstname.localeCompare(b.firstname));
    return this.buildAlphabeticalGroups(sorted);
  });

  /**
   * Angular lifecycle hook. Initializes contact data and sets up realtime subscription.
   * @returns {void}
   */
  ngOnInit(): void {
    this.contactsService.getContacts();
    this.contactsService.subscribeToContacts();
  }

  /**
   * Selects a contact, transforms its data for the UI, and emits the selection event.
   * Fulfills User Story 2 (viewing contact details).
   * @param {Contact} contact - The contact object received from Contacts-Service.
   * @returns {void}
   */
  public selectContact(contact: Contact): void {
    const isFirstTime = this.selectedContact() === null;
    const transformed = this.transformContactData(contact);

    if (isFirstTime) {
      (transformed as any).isFirstClick = true;
      this.selectedContact.set(transformed);
      this.contactSelected.emit(transformed);
      this.cdr.detectChanges();

      setTimeout(() => {
        const current = this.selectedContact();
        if (current && (current as any).isFirstClick === true) {
          (current as any).isFirstClick = false;
          this.selectedContact.set({ ...current });
          this.cdr.detectChanges();
        }
      }, 150);

    } else {
      (transformed as any).isFirstClick = false;
      this.selectedContact.set(transformed);
      this.contactSelected.emit(transformed);
    }
  }

  /**
   * Groups a sorted list of contacts into alphabetical sections based on the first letter.
   * @param {Contact[]} sorted - Array of sorted raw contacts.
   * @returns {ContactGroup[]} Array of grouped contacts containing the letter and matching UI contacts.
   */
  private buildAlphabeticalGroups(sorted: Contact[]): ContactGroup[] {
    const groups: { [key: string]: UIContact[] } = {};

    for (const contact of sorted) {
      const firstLetter = contact.firstname?.charAt(0).toUpperCase() || 'A';
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(this.transformContactData(contact));
    }

    return Object.keys(groups)
      .sort((a, b) => a.localeCompare(b))
      .map((letter) => ({ letter, contacts: groups[letter] }));
  }

  /**
   * Transforms raw Contacts-Service database fields into UI-ready fields like combined name, initials, and colors.
   * @param {Contact} contact - The raw database contact object.
   * @returns {UIContact} The enriched contact object including UI properties.
   */
  private transformContactData(contact: Contact): UIContact {
    const firstLetter = contact.firstname?.charAt(0).toUpperCase() || '';
    const lastLetter = contact.lastname?.charAt(0).toUpperCase() || '';
    const contactId = typeof contact.id === 'number' ? contact.id : 0;
    const colorIndex = Math.abs(contactId) % this.availableColors.length;
    return {
      ...contact,
      name: `${contact.firstname} ${contact.lastname}`,
      initials: `${firstLetter}${lastLetter}`,
      avatarColor: this.availableColors[colorIndex],
    };
  }
}
