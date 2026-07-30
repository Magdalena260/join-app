import { Component, inject, OnInit, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { tasksService } from '../../../../shared/services/tasks-service';
import { contactsService } from '../../../../shared/services/contacts-service';
import { Task } from '../../../../shared/interfaces/tasks';

/**
 * Component managing the isolated modal representation of a singular task entity.
 * Handles deep relational data mapping for collaborator visualization, delegates direct
 * subtask state mutations, and dispatches structural view transitions via Angular outputs.
 */
@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.scss',
})
export class TaskDetail implements OnInit {
  /**
   * Injected service singleton orchestrating database transactions and reactive signal streams for task entities.
   */
  dbTasks = inject(tasksService);

  /**
   * Injected service singleton managing the global registry and localized retrieval of contact view models.
   */
  dbContacts = inject(contactsService);

  /**
   * Event emitter dispatching the active task entity payload up the component tree to
   * trigger external form mutations and overlay transitions.
   */
  @Output() editTask = new EventEmitter<Task>();

  /**
   * Caches the externally bound task entity serving as the primary structural context for the modal interface.
   */
  task: Task | null = null;

  /**
   * Reactive boolean flag driving the DOM visibility matrix of the modal backdrop overlay.
   */
  isOpen: boolean = false;

  /**
   * Lifecycle hook triggered upon component instantiation to evaluate session loading footprints
   * and asynchronously pre-fetch the global contact registry for downstream relational mapping.
   */
  async ngOnInit() {
    await this.dbContacts.getContacts();
  }

  /**
   * Instantiates the view matrix for a specific task entity and unlocks the modal overlay boundaries.
   *
   * @param {Task} task - The targeted task entity payload to inject into the modal state context.
   */
  openDialog(task: Task) {
    this.task = task;
    this.isOpen = true;
  }

  /**
   * Executes the modal termination sequence. Defers the internal state purge via a micro-task timeout
   * to guarantee fluid CSS exit transitions before the contextual data model is destroyed.
   */
  closeDialog() {
    this.isOpen = false;
    setTimeout(() => {
      this.task = null;
    }, 300);
  }

  /**
   * Evaluates the active task's relational collaborator footprint against the global contact cache.
   * Synthesizes complex view models containing dynamically computed initials and deterministic badge colors.
   *
   * @returns {Array<any>} A synthesized array of augmented contact view objects assigned to the current constraint.
   */
  get assignedContacts() {
    if (!this.task || !this.task.collaborators || this.task.collaborators.length === 0) {
      return [];
    }

    const allContacts = this.dbContacts.contacts();
    const badgeColors = ['#1FD7C1', '#462F8A', '#0038FF', '#FF7A00', '#FF5EB3', '#9327FF'];

    return this.task.collaborators
      .map((id) => {
        const contact = allContacts.find((c) => c.id === id);

        if (!contact) return undefined;

        return {
          ...contact,
          fullName: `${contact.firstname} ${contact.lastname}`,
          initials: `${contact.firstname.charAt(0)}${contact.lastname.charAt(0)}`.toUpperCase(),
          color: badgeColors[(contact.id || 0) % badgeColors.length],
        };
      })
      .filter((contact) => contact !== undefined);
  }

  /**
   * Evaluates interaction patterns inside the nested subtask array to invert localized binary completion flags.
   * Dispatches an asynchronous database update protocol to persist the mutated state tree globally.
   *
   * @param {number} index - The zero-based array index identifying the targeted subtask node.
   */
  async toggleSubtask(index: number) {
    if (!this.task || !this.task.subtasks) return;
    const currentStatus = this.task.subtasks[index].status;
    this.task.subtasks[index].status = currentStatus === 1 ? 0 : 1;
    await this.dbTasks.updateTask(this.task);
  }

  /**
   * Intercepts localized destruction intents. Triggers an asynchronous deletion protocol via the task service
   * and cascades the modal termination sequence upon successful network resolution.
   */
  async onDeleteClick() {
    if (this.task && this.task.id !== undefined) {
      try {
        await this.dbTasks.deleteTask(this.task.id);
        this.closeDialog();
      } catch (error) {
        console.error('Fehler beim Löschen des Tasks:', error);
      }
    }
  }

  /**
   * Resolves explicit edit intents by emitting the cached task entity up the DOM hierarchy.
   * Triggers immediate modal termination to gracefully yield the viewport to the targeted form interface.
   */
  onEditClick() {
    if (this.task) {
      this.editTask.emit(this.task);
      this.closeDialog();
    }
  }
}
