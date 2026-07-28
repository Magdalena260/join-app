import { Component, ElementRef, ViewChild } from '@angular/core';
import { AddTask } from '../../../add-task/add-task';
import { Task } from '../../../../shared/interfaces/tasks';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [AddTask, ButtonComponent],
  templateUrl: './task-dialog.html',
  styleUrl: './task-dialog.scss',
})
export class TaskDialog {
  @ViewChild('dialog') dialog!: ElementRef<HTMLDialogElement>;
  @ViewChild(AddTask) addTaskComponent!: AddTask;

  currentTask: Task | null = null;
  currentColumnId = 'todo';

  /** Opens the dialog in create or edit mode. */
  openDialog(data: { columnId?: string; task?: Task } = {}): void {
    this.currentTask = data.task || null;
    this.currentColumnId = data.columnId || 'todo';

    this.dialog.nativeElement.showModal();
  }

  /** Closes the dialog and clears the selected edit task. */
  closeDialog(): void {
    this.dialog.nativeElement.close();

    setTimeout(() => {
      this.currentTask = null;
      this.currentColumnId = 'todo';
    }, 300);
  }

  /** Saves the task through the embedded add task component. */
  async saveTask(): Promise<void> {
    await this.addTaskComponent.createTask();
  }

  clearTask(): void {
    this.addTaskComponent.clearTaskForm();
  }
}