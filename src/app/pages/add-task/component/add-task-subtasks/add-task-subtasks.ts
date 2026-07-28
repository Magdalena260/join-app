import { Component, ElementRef, HostListener, Input, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';

/** Subtask data used inside the add task form before saving. */
type Subtask = {
  id: number;
  name: string;
};

@Component({
  selector: 'app-add-task-subtasks',
  standalone: true,
  imports: [],
  templateUrl: './add-task-subtasks.html',
  styleUrl: './add-task-subtasks.scss',
})
export class AddTaskSubtasks {
  @Input({ required: true }) form!: FormGroup;

  private elementRef = inject(ElementRef<HTMLElement>);

  currentSubtaskId = 1;
  currentSubtasks: Subtask[] = [];
  editingSubtaskId: number | null = null;
  isTextInSubtaskInput = false;

  /** Checks whether the subtask input currently contains text. */
  checkTextInSubtaskInput(inputElement: HTMLInputElement): void {
    this.isTextInSubtaskInput = inputElement.value.trim() !== '';
  }

  /** Clears the subtask input field and hides the submit controls. */
  clearSubtaskInput(inputElement: HTMLInputElement): void {
    inputElement.value = '';
    this.isTextInSubtaskInput = false;
  }

  /** Adds a new subtask to the local list and updates the form. */
  addSubtask(inputElement: HTMLInputElement): void {
    const value = inputElement.value.trim();

    if (!value) {
      return;
    }

    this.currentSubtasks.push({
      id: this.currentSubtaskId,
      name: value,
    });

    this.currentSubtaskId++;
    inputElement.value = '';
    this.isTextInSubtaskInput = false;
    this.updateSubtasksForm();
  }

  /** Removes a selected subtask from the local list and updates the form. */
  deleteSelectedSubtask(id: number): void {
    this.currentSubtasks = this.currentSubtasks.filter((subtask) => subtask.id !== id);
    this.updateSubtasksForm();
  }

  /** Enables edit mode for the selected subtask. */
  editSelectedSubtask(id: number): void {
    this.editingSubtaskId = id;
  }

  /** Checks whether the given subtask is currently being edited. */
  isEditingSubtask(id: number): boolean {
    return this.editingSubtaskId === id;
  }

  /** Saves the edited subtask name and updates the form. */
  saveSelectedSubtask(id: number, newValue: string): void {
    const trimmedName = newValue.trim();

    if (!trimmedName) {
      return;
    }

    const subtask = this.currentSubtasks.find((subtask) => subtask.id === id);

    if (!subtask) {
      return;
    }

    subtask.name = trimmedName;
    this.updateSubtasksForm();

    setTimeout(() => {
      this.editingSubtaskId = null;
    });
  }

  /** Cancels subtask edit mode without saving changes. */
  cancelEditSubtask(): void {
    this.editingSubtaskId = null;
  }

  /** Loads existing subtasks into the local list for edit mode. */
  loadSubtasks(subtasks: { name: string }[]): void {
    this.currentSubtasks = subtasks.map((subtask, index) => ({
      id: index + 1,
      name: subtask.name,
    }));

    this.currentSubtaskId = this.currentSubtasks.length + 1;
    this.editingSubtaskId = null;
    this.isTextInSubtaskInput = false;
    this.updateSubtasksForm();
  }

  /** Clears all local subtask data and resets the form subtasks. */
  clearSubtasks(): void {
    this.currentSubtaskId = 1;
    this.currentSubtasks = [];
    this.editingSubtaskId = null;
    this.isTextInSubtaskInput = false;
    this.updateSubtasksForm();
  }

  /** Syncs the local subtask list with the parent task form. */
  private updateSubtasksForm(): void {
    this.form.patchValue({
      subtasks: this.currentSubtasks,
    });
  }

  /** Cancels edit mode when clicking outside the active edit input. */
  @HostListener('document:pointerdown', ['$event'])
  closeEditInputOnPointerDown(event: PointerEvent): void {
    if (this.editingSubtaskId === null) {
      return;
    }

    const target = event.target as HTMLElement;
    const clickedInsideEditInput = target.closest('.subtasks__list__element__editInput');

    if (!clickedInsideEditInput) {
      this.cancelEditSubtask();
    }
  }
}