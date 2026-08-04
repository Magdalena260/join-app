import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
  inject,
  output,
  signal
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AddTaskBasicInfo } from './component/add-task-basic-info/add-task-basic-info';
import { AddTaskDetailInfo } from './component/add-task-detail-info/add-task-detail-info';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { Task } from '../../shared/interfaces/tasks';
import { contactsService } from '../../shared/services/contacts-service';
import { tasksService } from '../../shared/services/tasks-service';

type Priority = 'urgent' | 'medium' | 'low';

type AssignedContact = {
  id: number;
  firstname: string;
  lastname: string;
  name: string;
};

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [AddTaskBasicInfo, AddTaskDetailInfo, ButtonComponent, ReactiveFormsModule],
  templateUrl: './add-task.html',
  styleUrl: './add-task.scss',
})
export class AddTask implements OnChanges, AfterViewInit, OnInit {
  @Input() task: Task | null = null;
  @Input() columnId = 'todo';
  @Input() isDialogMode = false;

  taskSaved = output<void>();

  @ViewChild(AddTaskDetailInfo) detailInfo!: AddTaskDetailInfo;

  private tasksService = inject(tasksService);
  private contactDatabase = inject(contactsService);
  private viewInitialized = false;
  private router = inject(Router);

  isSuccessMsgVisible = signal(false);

  addTaskForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    description: new FormControl('', {
      nonNullable: true,
    }),
    dueDate: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    assignedTo: new FormControl<AssignedContact[]>([], {
      nonNullable: true,
    }),
    category: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    priority: new FormControl<Priority>('medium', {
      nonNullable: true,
    }),
    subtasks: new FormControl<{ id: number; name: string }[]>([], {
      nonNullable: true,
    }),
  });

  /** Shows the task success message and navigates back to the board. */
  showSuccessMessage(): void {
    this.isSuccessMsgVisible.set(true);

    setTimeout(() => {
      this.isSuccessMsgVisible.set(false);
      this.router.navigate(['/board']);
    }, 2000);
  }

  /** Loads contacts and patches edit task data once contacts are available. */
  async ngOnInit(): Promise<void> {
    await this.contactDatabase.getContacts();

    if (this.task) {
      this.patchTaskToForm();
    }
  }

  /** Updates the form whenever a task is passed for editing. */
  ngOnChanges(): void {
    if (!this.task) {
      this.clearTaskForm();
      return;
    }

    this.patchTaskToForm();
  }

  /** Marks the child view as ready and loads edit subtasks into the subtask component. */
  ngAfterViewInit(): void {
    this.viewInitialized = true;

    if (this.task?.subtasks) {
      this.detailInfo?.loadSubtasks(this.task.subtasks);
    }
  }

  /** Resets the task form and clears local child component state. */
  clearTaskForm(): void {
    this.addTaskForm.reset({
      title: '',
      description: '',
      dueDate: '',
      assignedTo: [],
      category: '',
      priority: 'medium',
      subtasks: [],
    });

    this.detailInfo?.clearDetailInfo();
  }

  /** Validates, creates or updates the task, then clears the form. */
  async createTask(): Promise<void> {
    if (this.addTaskForm.invalid) {
      this.addTaskForm.markAllAsTouched();
      return;
    }

    const taskPayload = this.mapFormToTaskPayload();

    if (this.task?.id) {
      await this.tasksService.updateTask({
        ...taskPayload,
        id: this.task.id,
      });
    } else {
      await this.tasksService.setTask([taskPayload]);
    }

    this.clearTaskForm();
    this.showSuccessMessage();
    this.taskSaved.emit();
  }

  /** Patches the selected edit task into the reactive form. */
  private patchTaskToForm(): void {
    if (!this.task) {
      return;
    }

    this.addTaskForm.patchValue({
      title: this.task.title,
      description: this.task.desc,
      dueDate: this.task.due_date.split('T')[0],
      assignedTo: this.mapCollaboratorIdsToContacts(this.task.collaborators || []),
      category: this.mapCategoryFromNumber(this.task.category),
      priority: this.mapPriorityFromNumber(this.task.priority),
      subtasks:
        this.task.subtasks?.map((subtask, index) => ({
          id: index + 1,
          name: subtask.name,
        })) || [],
    });

    if (this.viewInitialized) {
      this.detailInfo?.loadSubtasks(this.task.subtasks || []);
    }
  }

  /** Maps form values to the task payload expected by the database. */
  private mapFormToTaskPayload() {
    const formValue = this.addTaskForm.getRawValue();

    return {
      title: formValue.title,
      desc: formValue.description,
      due_date: formValue.dueDate,
      status: this.task?.status ?? this.mapColumnIdToStatus(this.columnId),
      priority: this.mapPriorityToNumber(formValue.priority),
      collaborators: formValue.assignedTo.map((contact) => contact.id),
      subtasks: formValue.subtasks.map((subtask) => ({
        name: subtask.name,
        status: 0,
      })),
      category: this.mapCategoryToNumber(formValue.category),
    };
  }

  private mapColumnIdToStatus(columnId: string): number {
  if (columnId === 'todo') {
    return 0;
  }

  if (columnId === 'progress') {
    return 1;
  }

  if (columnId === 'feedback') {
    return 2;
  }

  return 0;
}

  /** Converts collaborator ids from the task into contact objects for the form. */
  private mapCollaboratorIdsToContacts(collaboratorIds: number[]): AssignedContact[] {
    return collaboratorIds
      .map((id) => {
        const contact = this.contactDatabase.contacts().find((contact) => contact.id === id);

        if (!contact || contact.id === undefined) {
          return null;
        }

        return {
          id: contact.id,
          firstname: contact.firstname,
          lastname: contact.lastname,
          name: `${contact.firstname} ${contact.lastname}`,
        };
      })
      .filter((contact): contact is AssignedContact => contact !== null);
  }

  /** Converts the selected category label to its database value. */
  private mapCategoryToNumber(category: string): number {
    return category === 'User Story' ? 0 : 1;
  }

  /** Converts the database category value to its form label. */
  private mapCategoryFromNumber(category: number): string {
    return category === 0 ? 'User Story' : 'Technical Task';
  }

  /** Converts the selected priority label to its database value. */
  private mapPriorityToNumber(priority: Priority): number {
    if (priority === 'urgent') {
      return 2;
    }

    if (priority === 'medium') {
      return 1;
    }

    return 0;
  }

  /** Converts the database priority value to its form label. */
  private mapPriorityFromNumber(priority: number): Priority {
    if (priority === 2) {
      return 'urgent';
    }

    if (priority === 1) {
      return 'medium';
    }

    return 'low';
  }
}