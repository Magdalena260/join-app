import { Component, computed, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Task } from '../../../shared/interfaces/tasks';
import { tasksService } from '../../../shared/services/tasks-service';

@Component({
  selector: 'app-cards',
  imports: [RouterLink],
  templateUrl: './cards.html',
  styleUrl: './cards.scss',
})
export class Cards  implements OnInit {
  private tasksService = inject(tasksService);

  /** Counts all tasks with the to-do status. */
  todoTasksCount = computed(() => {
    return this.tasksService.tasks().filter(task => task.status === 0).length;
  });

  /** Counts all tasks with the in-progress status. */
  progressTasksCount = computed(() => {
    return this.tasksService.tasks().filter(task => task.status === 1).length;
  });

  /** Counts all tasks with the awaiting-feedback status. */
  feedbackTasksCount = computed(() => {
    return this.tasksService.tasks().filter(task => task.status === 2).length;
  });

  /** Counts all completed tasks. */
  doneTasksCount = computed(() => {
    return this.tasksService.tasks().filter(task => task.status === 3).length;
  });

  /** Counts all active board tasks except completed tasks. */
  tasksInBoard = computed(() => {
    return this.todoTasksCount() + this.progressTasksCount() + this.feedbackTasksCount();
  });

  /** Counts all urgent tasks. */
  urgentTaskCount = computed(() => {
    return this.tasksService.tasks().filter(task => task.priority === 2).length
  })

  /** Returns the task with the closest upcoming due date. */
  closestDueTask = computed(() => {
    const today = new Date().getTime();

    return this.tasksService.tasks()
      .filter(task => task.due_date)
      .filter(task => new Date(task.due_date).getTime() >= today)
      .reduce((closestTask, currentTask) => {
        if (!closestTask) {
          return currentTask;
        }

        const closestTime = new Date(closestTask.due_date).getTime();
        const currentTime = new Date(currentTask.due_date).getTime();

        return currentTime < closestTime ? currentTask : closestTask;
      }, null as Task | null);
  });

  /** Returns the due date of the closest upcoming task. */
  closestDueDate = computed(() => {
    return this.closestDueTask()?.due_date ?? '';
  });

  /** Loads tasks and subscribes to realtime task updates. */
  async ngOnInit(): Promise<void> {
    await this.tasksService.getTasks();
    await this.tasksService.subscribeToTasks();
  }

  /** Formats a date for the summary card display. */
  formatDateForSummary(date: string): string {
    const parsedDate = new Date(date);

    return parsedDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }
}
