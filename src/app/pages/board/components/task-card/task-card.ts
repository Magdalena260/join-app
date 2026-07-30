import { Component, inject, Input, OnInit } from '@angular/core';
import { Task } from '../../../../shared/interfaces/tasks';
import { tasksService } from '../../../../shared/services/tasks-service';
import { contactsService } from '../../../../shared/services/contacts-service';
import { ProfileIcon } from '../../../../shared/components/profile-icon/profile-icon';

/**
 * Component managing the visual representation and isolated interaction layer of a singular task entity.
 * Evaluates local bound parameters to render dynamic progress metrics, contextual user assignments,
 * and dispatches state mutations for column migrations.
 */
@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [ProfileIcon],
  templateUrl: './task-card.html',
  styleUrl: './task-card.scss',
})
export class TaskCard implements OnInit {
  /**
   * Externally bound task entity payload serving as the primary data context for this visual node.
   */
  @Input() task?: Task;

  /**
   * Injected service singleton orchestrating database transactions and reactive signal streams for task entities.
   */
  dbTasks = inject(tasksService);

  /**
   * Injected service singleton managing the global registry and retrieval of contact entities.
   */
  dbContacts = inject(contactsService);

  /**
   * Static matrix of CSS variable identifiers used for deterministic color hashing of assignee avatars.
   */
  availableColors: string[] = [
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
   * Lifecycle hook triggered upon component initialization to dispatch asynchronous database fetch routines,
   * ensuring the local cache is populated for relational data mappings.
   */
  async ngOnInit() {
    await this.dbTasks.getTasks();
    await this.dbContacts.getContacts();
  }

  /**
   * Evaluates the active task's collaborator IDs against the global contact registry cache.
   * Maps raw relational endpoints into enriched view models containing deterministic avatar colors and computed initials.
   *
   * @returns {Array<any>} Array of synthesized contact view objects assigned to this task constraint.
   */
  get assignedContacts() {
    if (!this.task || !this.task.collaborators || this.task.collaborators.length === 0) {
      return [];
    }

    const allContacts = this.dbContacts.contacts();

    return this.task.collaborators
      .map((id) => {
        const contact = allContacts.find((c) => c.id === id);
        if (!contact) return undefined;

        const firstLetter = contact.firstname?.charAt(0).toUpperCase() || '';
        const lastLetter = contact.lastname?.charAt(0).toUpperCase() || '';
        const colorIndex =
          (contact.firstname.length + contact.lastname.length) % this.availableColors.length;

        return {
          ...contact,
          initials: `${firstLetter}${lastLetter}`,
          avatarColor: this.availableColors[colorIndex],
        };
      })
      .filter((contact) => contact !== undefined);
  }

  /**
   * Computes a truncated subset of the assigned collaborator matrix for constrained visual representation.
   * Enforces a maximum rendering limit to preserve layout integrity on the primary card face.
   *
   * @returns {Array<any>} Sliced array of contact view objects permitted within the visible bounds.
   */
  get visibleContacts() {
    const contacts = this.assignedContacts;
    if (contacts.length <= 4) {
      return contacts;
    }
    return contacts.slice(0, 3);
  }

  /**
   * Calculates the numerical overflow of collaborators exceeding the primary visual bounding box.
   *
   * @returns {number} Integer representing the surplus count of assigned contacts.
   */
  get extraContactsCount() {
    const contacts = this.assignedContacts;
    return contacts.length > 4 ? contacts.length - 3 : 0;
  }

  /**
   * Computes a filtered matrix of viable column destinations for the active task entity,
   * excluding the current status vector to prevent circular migration loops.
   *
   * @param {number} currentStatus - The integer mapping of the task's present column state.
   * @returns {Array<{id: string, title: string, status: number}>} Array of valid migration targets.
   */
  getAvailableTargetColumns(currentStatus: number) {
    const columns = [
      { id: 'todo', title: 'To-do', status: 0 },
      { id: 'progress', title: 'In progress', status: 1 },
      { id: 'feedback', title: 'Await feedback', status: 2 },
      { id: 'done', title: 'Done', status: 3 },
    ];
    return columns.filter((col) => col.status !== currentStatus);
  }

  /**
   * Orchestrates the state mutation sequence to migrate the contextual task across board boundaries.
   * Purges the active popover node from the DOM and dispatches an explicit database update protocol.
   *
   * @param {any} task - The targeted task entity payload undergoing state mutation.
   * @param {string} targetColumnId - The evaluated lexical identifier of the destination column.
   */
  moveTaskTo(task: any, targetColumnId: string) {
    if (!task) return;

    let newStatus = 0;
    switch (targetColumnId) {
      case 'todo':
        newStatus = 0;
        break;
      case 'progress':
        newStatus = 1;
        break;
      case 'feedback':
        newStatus = 2;
        break;
      case 'done':
        newStatus = 3;
        break;
    }

    task.status = newStatus;
    this.dbTasks.updateTask(task);

    const popover = document.getElementById('move-popover-' + task.id);
    if (popover) {
      (popover as any).hidePopover();
    }
  }

  /**
   * Iterates through the localized subtask matrix to calculate the absolute volume of completed nodes.
   * Assesses binary status flags across the array to establish linear progression metrics.
   *
   * @returns {number} The aggregate count of subtasks evaluating to a completed state.
   */
  getCompletedSubtasksCount(): number {
    if (!this.task?.subtasks) return 0;
    return this.task.subtasks.filter((subtask) => subtask.status === 1).length;
  }

  /**
   * Evaluates the completion volume against the total bounded subtask matrix to compute a relative width ratio.
   * Outputs a sanitized mathematical percentage designed for direct CSS style binding on progress indicators.
   *
   * @returns {number} Float value representing the absolute completion ratio between 0 and 100.
   */
  getCompletionPercentage(): number {
    if (!this.task?.subtasks || this.task.subtasks.length === 0) return 0;
    const completed = this.getCompletedSubtasksCount();
    return (completed / this.task.subtasks.length) * 100;
  }
}
