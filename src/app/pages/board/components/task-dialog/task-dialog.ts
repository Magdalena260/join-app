import { Component, ElementRef, ViewChild } from '@angular/core';
import { AddTask } from '../../../add-task/add-task';
import { Task } from '../../../../shared/interfaces/tasks';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

/**
 * Component managing the localized modal boundary for task creation and mutation sequences.
 * Orchestrates the integration of the generalized form matrix within a dialog overlay,
 * handling programmatic state transitions and data passing across structural view hierarchies.
 */
@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [AddTask, ButtonComponent],
  templateUrl: './task-dialog.html',
  styleUrl: './task-dialog.scss',
})
export class TaskDialog {
  /**
   * Core Angular reference mapping to the native HTML dialog element overlay.
   * Used to programmatically dispatch structural display mutations.
   */
  @ViewChild('dialog') dialog!: ElementRef<HTMLDialogElement>;

  /**
   * Core Angular ViewChild reference pointing to the embedded form interface.
   * Grants direct programmatic access to trigger localized form evaluations and sub-routines.
   */
  @ViewChild(AddTask) addTaskComponent!: AddTask;

  /**
   * Volatile payload cache maintaining the active task entity context.
   * Evaluates to null during creation flows, or binds to a valid entity during mutation sequences.
   */
  currentTask: Task | null = null;

  /**
   * State flag maintaining the active destination identifier for newly instantiated task entities.
   */
  currentColumnId = 'todo';

  /**
   * Dispatches explicit signals to evaluate the modal context and transition the overlay state to visible.
   * Synthesizes injection parameters to dynamically branch between fresh creation or targeted mutation matrices.
   *
   * @param {Object} [data] - Optional contextual payload.
   * @param {string} [data.columnId] - Targeted layout column identifier used as the baseline for new entities.
   * @param {Task} [data.task] - Existing task entity payload to populate the form fields for targeted mutation.
   */
  openDialog(data: { columnId?: string; task?: Task } = {}): void {
    this.currentTask = data.task || null;
    this.currentColumnId = data.columnId || 'todo';

    this.dialog.nativeElement.showModal();
  }

  /**
   * Executes the modal termination sequence and commands the native overlay to suppress visibility.
   * Defers the internal state purge via a micro-task timeout to guarantee fluid CSS exit transitions.
   */
  closeDialog(): void {
    this.dialog.nativeElement.close();

    setTimeout(() => {
      this.currentTask = null;
      this.currentColumnId = 'todo';
    }, 300);
  }

  /**
   * Delegates the primary validation and submission loop to the embedded form component instance.
   * Asynchronously resolves network operations and database mutations prior to concluding the execution cycle.
   *
   * @returns {Promise<void>} Deferred promise resolving upon the completion of the submission protocol.
   */
  async saveTask(): Promise<void> {
    await this.addTaskComponent.createTask();
  }

  /**
   * Intercepts explicit reset intents to purge evaluated text streams and bound states
   * within the encapsulated form component architecture.
   */
  clearTask(): void {
    this.addTaskComponent.clearTaskForm();
  }
}
