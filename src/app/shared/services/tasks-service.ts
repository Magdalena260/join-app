import { Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { createClient, RealtimeChannel } from '@supabase/supabase-js';
import { Task } from '../interfaces/tasks';

/**
 * Injectable service singleton orchestrating CRUD operations and real-time state synchronization for task entities.
 * Manages remote network mutations via the Supabase client layer and exposes localized reactive data streams using Angular signals.
 */
@Injectable({
  providedIn: 'root',
})
export class tasksService {
  /**
   * Instantiated Supabase client node establishing the secure network connection mapped to the backend database architecture.
   */
  supabase = createClient(environment.apiUrl, environment.apiKey);

  /**
   * Reactive signal stream maintaining the global memory cache of task view models.
   * Broadcasts localized matrix mutations to subscribed view hierarchies across the application.
   */
  tasks = signal<Task[]>([]);

  /**
   * Volatile cache storing the active remote websocket subscription node.
   * Prevents redundant connection multiplexing and memory leaks across the session lifecycle.
   */
  channels: RealtimeChannel | undefined;

  /**
   * Initiates an asynchronous network mutation to push an array of new task entities into the remote database.
   * Evaluates payload criteria and intercepts raw transaction faults during the persistence sequence.
   *
   * @param {Task[]} tasks - Array matrix of task entity payloads queued for remote insertion.
   * @returns {Promise<any>} Deferred promise resolving the inserted data payload or undefined on network fault.
   */
  async setTask(tasks: Task[]) {
    const { data, error } = await this.supabase.from('tasks').insert(tasks).select();

    if (error) {
      console.error('Tasks insert error', error);
      return;
    }
    return data;
  }

  /**
   * Dispatches an asynchronous network request to fetch the complete relational matrix of task entities.
   * Overwrites the localized signal cache upon successful network resolution to ensure client-server parity.
   */
  async getTasks() {
    const { data: tasks, error } = await this.supabase.from('tasks').select('*');
    if (!tasks) return;
    this.tasks.set(tasks);
  }

  /**
   * Executes a targeted asynchronous network fetch to retrieve an isolated task entity based on its relational identifier.
   *
   * @param {number} id - The unique numerical index mapping to the targeted task entity in the backend architecture.
   * @returns {Promise<any>} Deferred promise resolving the isolated task payload or undefined on network fault.
   */
  async getSingleTask(id: number) {
    const { data: task, error } = await this.supabase
      .from('tasks')
      .select('*')
      .eq('id', id)
      .single();
    if (error) {
      console.error('Tasks get single task error', error);
      return;
    }
    return task;
  }

  /**
   * Initiates an asynchronous network mutation to update an existing task entity mapped within the remote database.
   *
   * @param {Task} task - The mutated task entity payload containing the localized property changes and its relational identifier.
   */
  async updateTask(task: Task) {
    const { error } = await this.supabase.from('tasks').update(task).eq('id', task.id);
    if (error) {
      console.error('Tasks update task error', error);
    }
  }

  /**
   * Dispatches an explicit network termination signal to purge a targeted task entity from the remote database schema.
   *
   * @param {number} id - The unique numerical index resolving to the task entity targeted for destruction.
   */
  async deleteTask(id: number) {
    const response = await this.supabase.from('tasks').delete().eq('id', id);
  }

  /**
   * Establishes a persistent bidirectional websocket connection to the remote database channel.
   * Binds real-time Postgres mutation events to the localized payload handler to continuously sync the client state.
   */
  async subscribeToTasks() {
    if (this.channels) {
      return;
    }
    this.channels = this.supabase
      .channel('tasks-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, (payload) => {
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
      this.tasks.update((tasks) => [...tasks, payload.new]);
    } else if (payload.eventType === 'UPDATE') {
      this.tasks.update((tasks) =>
        tasks.map((task) => (task.id === payload.new.id ? payload.new : task)),
      );
    } else if (payload.eventType === 'DELETE') {
      this.tasks.update((tasks) => tasks.filter((task) => task.id !== payload.old.id));
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
