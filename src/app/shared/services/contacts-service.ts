import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { createClient, RealtimeChannel } from '@supabase/supabase-js';
import { Contact } from '../interfaces/contact';

/**
 * Injectable service singleton orchestrating CRUD operations and real-time state synchronization for contact entities.
 * Manages remote network mutations via the Supabase client layer and exposes localized reactive data streams using Angular signals.
 */
@Injectable({
  providedIn: 'root',
})
export class contactsService {
  /**
   * Instantiated Supabase client node establishing the secure network connection mapped to the backend database architecture.
   */
  supabase = createClient(environment.apiUrl, environment.apiKey);

  /**
   * Reactive signal stream maintaining the global memory cache of contact view models.
   * Broadcasts localized matrix mutations to subscribed view hierarchies across the application.
   */
  contacts = signal<Contact[]>([]);

  /**
   * Volatile cache storing the active remote websocket subscription node.
   * Prevents redundant connection multiplexing and memory leaks across the session lifecycle.
   */
  channels: RealtimeChannel | undefined;

  /**
   * Initiates an asynchronous network mutation to push an array of new contact entities into the remote database.
   * Evaluates payload criteria and intercepts raw transaction faults during the persistence sequence.
   *
   * @param {Contact[]} contacts - Array matrix of contact entity payloads queued for remote insertion.
   * @returns {Promise<any>} Deferred promise resolving the inserted data payload or undefined on network fault.
   */
  async setContact(contacts: Contact[]) {
    const { data, error } = await this.supabase.from('contacts').insert(contacts).select();

    if (error) {
      console.error('Contacts insert error', error);
      return;
    }
    return data;
  }

  /**
   * Dispatches an asynchronous network request to fetch the complete relational matrix of contact entities.
   * Overwrites the localized signal cache upon successful network resolution to ensure client-server parity.
   */
  async getContacts() {
    const { data: contacts, error } = await this.supabase.from('contacts').select('*');
    if (!contacts) return;
    this.contacts.set(contacts);
  }

  /**
   * Executes a targeted asynchronous network fetch to retrieve an isolated contact entity based on its relational identifier.
   *
   * @param {number} id - The unique numerical index mapping to the targeted contact entity in the backend architecture.
   * @returns {Promise<any>} Deferred promise resolving the isolated contact payload or undefined on network fault.
   */
  async getSingleContact(id: number) {
    const { data: contact, error } = await this.supabase
      .from('contacts')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      console.error('Contacts get single contact error', error);
      return;
    }
    return contact;
  }

  /**
   * Initiates an asynchronous network mutation to update an existing contact entity mapped within the remote database.
   *
   * @param {Contact} contact - The mutated contact entity payload containing the localized property changes and its relational identifier.
   */
  async updateContact(contact: Contact): Promise<void> {
  const updateData = {
    firstname: contact.firstname,
    lastname: contact.lastname,
    email: contact.email,
    telephone: contact.telephone,};

    const { error } = await this.supabase
      .from('contacts')
      .update(updateData)
      .eq('id', contact.id);

    if (error) {
      console.error('Contacts update contact error', error);
    }
  }

  /**
   * Dispatches an explicit network termination signal to purge a targeted contact entity from the remote database schema.
   *
   * @param {number} id - The unique numerical index resolving to the contact entity targeted for destruction.
   */
  async deleteContact(id: number) {
    const response = await this.supabase.from('contacts').delete().eq('id', id);
  }

  /**
   * Establishes a persistent bidirectional websocket connection to the remote database channel.
   * Binds real-time Postgres mutation events to the localized payload handler to continuously sync the client state.
   */
  async subscribeToContacts() {
    if (this.channels) {
      return;
    }
    this.channels = this.supabase
      .channel('contacts-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contacts' }, (payload) => {
        this.handlePayload(payload);
      })
      .subscribe();
  }

  /**
   * Intercepts structured payload events dispatched from the remote websocket stream.
   * Evaluates the active mutation vector (INSERT, UPDATE, DELETE) to programmatically synchronize the localized signal matrix.
   *
   * @param {any} payload - The structured event payload containing the relational mutation data and previous/new node states.
   */
  handlePayload(payload: any) {
    if (payload.eventType === 'INSERT') {
      this.contacts.update((contacts) => [...contacts, payload.new]);
    } else if (payload.eventType === 'UPDATE') {
      this.contacts.update((contacts) =>
        contacts.map((contact) => (contact.id === payload.new.id ? payload.new : contact)),
      );
    } else if (payload.eventType === 'DELETE') {
      this.contacts.update((contacts) =>
        contacts.filter((contact) => contact.id !== payload.old.id),
      );
    }
  }

  /**
   * Lifecycle hook triggered upon service destruction.
   * Explicitly terminates the active websocket channel bindings and purges network listeners to prevent memory fragmentation.
   */
  ngOnDestroy() {
    if (this.channels) {
      this.supabase.removeChannel(this.channels);
    }
  }
}
