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

  todoTasksCount = computed(() => {
    return this.tasksService.tasks().filter(task => task.status === 0).length;
  });

  progressTasksCount = computed(() => {
    return this.tasksService.tasks().filter(task => task.status === 1).length;
  });

  feedbackTasksCount = computed(() => {
    return this.tasksService.tasks().filter(task => task.status === 2).length;
  });

  doneTasksCount = computed(() => {
    return this.tasksService.tasks().filter(task => task.status === 3).length;
  });

  tasksInBoard = computed(() => {
    return this.todoTasksCount() + this.progressTasksCount() + this.feedbackTasksCount();
  });

  urgentTaskCount = computed(() => {
    return this.tasksService.tasks().filter(task => task.priority === 2).length
  })

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

  closestDueDate = computed(() => {
    return this.closestDueTask()?.due_date ?? '';
  });

  async ngOnInit(): Promise<void> {
    await this.tasksService.getTasks();
    await this.tasksService.subscribeToTasks();
  }

  formatDateForSummary(date: string): string {
    const parsedDate = new Date(date);

    return parsedDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  }
}
