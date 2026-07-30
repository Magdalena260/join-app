import { Component, OnInit, inject, ViewChild, effect, ChangeDetectorRef } from '@angular/core';
import {
  CdkDragDrop,
  CdkDropList,
  CdkDrag,
  CdkDropListGroup,
  transferArrayItem,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { TaskCard } from './components/task-card/task-card';
import { BreakpointObserver } from '@angular/cdk/layout';
import { TaskDetail } from './components/task-detail/task-detail';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { TaskDialog } from './components/task-dialog/task-dialog';
import { tasksService } from '../../shared/services/tasks-service';

/**
 * Component managing the interactive Kanban board matrix.
 * Handles the CDK drag-and-drop lifecycle, real-time database synchronization,
 * and viewport-responsive state mutations for task entities.
 */
@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    TaskCard,
    TaskDetail,
    TaskDialog,
    ButtonComponent,
    CdkDropList,
    CdkDrag,
    CdkDropListGroup,
  ],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class Board implements OnInit {
  /**
   * Injected service singleton orchestrating database transactions and reactive signal streams for task entities.
   */
  dbTasks = inject(tasksService);

  /**
   * Core Angular change detector reference for manually flagging view hierarchies during asynchronous state mutations.
   */
  cdr = inject(ChangeDetectorRef);

  /**
   * Core Angular CDK layout observer evaluating media query matrices for viewport responsiveness.
   */
  breakpointObserver = inject(BreakpointObserver);

  /**
   * Binary flag indicating an active drag-and-drop sequence to suppress asynchronous layout thrashing during DOM manipulation.
   */
  isDragging = false;

  /**
   * Binary flag locking drag-and-drop capabilities based on evaluated viewport geometry thresholds.
   */
  isDragDisabled = false;

  /**
   * String cache holding the evaluated input stream used for lexical filtering of the task entity matrix.
   */
  searchQuery: string = '';

  /**
   * Structural configuration array defining the stateful columns and data binding targets for the Kanban viewport.
   */
  boardColumns = [
    {
      id: 'todo',
      title: 'To do',
      tasks: [] as any[],
      emptyText: 'No tasks to do',
      hasAddBtn: true,
    },
    {
      id: 'progress',
      title: 'In progress',
      tasks: [] as any[],
      emptyText: 'No tasks in progress',
      hasAddBtn: true,
    },
    {
      id: 'feedback',
      title: 'Await feedback',
      tasks: [] as any[],
      emptyText: 'No tasks awating feedback',
      hasAddBtn: true,
    },
    { id: 'done', title: 'Done', tasks: [] as any[], emptyText: 'No tasks done', hasAddBtn: false },
  ];

  /**
   * ViewChild reference pointing to the embedded task detail dialog component instance.
   */
  @ViewChild('taskDetail') TaskDetail!: TaskDetail;

  /**
   * ViewChild reference pointing to the embedded task mutation dialog component instance.
   */
  @ViewChild('addTaskDialog') addTaskDialog!: TaskDialog;

  /**
   * Instantiates the component wrapper context, establishing reactive effects for state synchronization
   * and subscribing to structural viewport layout changes.
   */
  constructor() {
    effect(() => {
      this.syncBoardWithDatabase();
    });

    this.breakpointObserver.observe(['(max-width: 1300px)']).subscribe((result) => {
      this.isDragDisabled = result.matches;
      this.cdr.markForCheck();
    });
  }

  /**
   * Absorbs standard change flows inside the search input node to update the lexical filter cache
   * and instantly trigger a local matrix synchronization.
   *
   * @param {Event} event - Native browser event payload intercepted from the input node boundary.
   */
  onSearch(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.searchQuery = inputElement.value.toLowerCase();
    this.syncBoardWithDatabase();
  }

  /**
   * Evaluates the global task signal stream against the active lexical search cache to distribute
   * entities into their respective column bounds. Bypasses execution if a drag sequence is actively locking the DOM.
   *
   * @private
   */
  private syncBoardWithDatabase() {
    const allDbTasks = this.dbTasks.tasks();

    if (this.isDragging) return;

    const filteredTasks = allDbTasks.filter((t) => {
      const matchesTitle = t.title?.toLowerCase().includes(this.searchQuery) ?? false;
      const matchesDesc = t.desc?.toLowerCase().includes(this.searchQuery) ?? false;

      return matchesTitle || matchesDesc;
    });

    this.boardColumns[0].tasks = filteredTasks.filter((t) => t.status === 0);
    this.boardColumns[1].tasks = filteredTasks.filter((t) => t.status === 1);
    this.boardColumns[2].tasks = filteredTasks.filter((t) => t.status === 2);
    this.boardColumns[3].tasks = filteredTasks.filter((t) => t.status === 3);

    this.cdr.markForCheck();
  }

  /**
   * Lifecycle hook triggered upon component initialization to dispatch asynchronous database fetch routines
   * and establish persistent subscription streams.
   */
  async ngOnInit() {
    await this.dbTasks.getTasks();
    await this.dbTasks.subscribeToTasks();
  }

  /**
   * Triggers the instantiation of the modal creation overlay, passing targeted column injection parameters.
   *
   * @param {string} status - The targeted column identifier serving as the initial state for the new entity.
   */
  openAddTaskDialog(status: string) {
    this.addTaskDialog.openDialog({ columnId: status });
  }

  /**
   * Dispatches an explicit overlay trigger to reveal deep diagnostic data for a selected task entity.
   *
   * @param {any} task - The targeted task entity payload.
   */
  openTaskDetails(task: any) {
    this.TaskDetail.openDialog(task);
  }

  /**
   * Triggers the instantiation of the modal mutation overlay, passing the active task entity for localized modification.
   *
   * @param {any} taskToEdit - The targeted task entity payload to populate the form matrix.
   */
  openEditTaskDialog(taskToEdit: any) {
    this.addTaskDialog.openDialog({ task: taskToEdit });
  }

  /**
   * Orchestrates the CDK drag-and-drop lifecycle termination sequence. Evaluates container boundaries to mutate
   * local array structures or dispatch explicit cross-column database updates.
   *
   * @param {CdkDragDrop<any[]>} event - The structured drag-and-drop event payload containing DOM indices and container context.
   * @param {string} newColumnId - The evaluated target column identifier used to mutate the task status.
   */
  drop(event: CdkDragDrop<any[]>, newColumnId: string) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      const taskToMove = event.item.data;

      let newStatus = 0;
      switch (newColumnId) {
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

      taskToMove.status = newStatus;
      this.dbTasks.updateTask(taskToMove);
    }

    setTimeout(() => {
      this.isDragging = false;
    }, 500);
  }
}
