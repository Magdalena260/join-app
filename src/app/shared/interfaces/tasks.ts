/**
 * Structural contract defining the data payload, state vectors, and relational
 * boundaries for a task entity within the application's Kanban architecture.
 */
export interface Task {
  /**
   * Optional unique relational identifier mapped to the backend database index.
   * Evaluates to undefined prior to successful network persistence.
   */
  id?: number;

  /**
   * String literal payload establishing the primary lexical heading of the task entity.
   */
  title: string;

  /**
   * Optional string literal payload caching the expanded diagnostic or contextual
   * description of the task constraints.
   */
  desc?: string;

  /**
   * String literal representing the chronological deadline boundary, evaluated
   * as a standardized date sequence.
   */
  due_date: string;

  /**
   * Integer mapping denoting the current column vector or progression state
   * within the Kanban execution matrix.
   */
  status: number;

  /**
   * Integer mapping establishing the hierarchical urgency level and visual
   * prioritization scaling of the task.
   */
  priority: number;

  /**
   * Optional nested array matrix defining localized sub-routines. Each node
   * contains a lexical identifier and a binary status flag mapping its completion state.
   */
  subtasks?: { name: string; status: number }[];

  /**
   * Optional array of relational integer indices mapping directly to the global
   * contact registry, denoting assigned user entities.
   */
  collaborators?: number[];

  /**
   * Integer mapping defining the structural classification or contextual
   * grouping subset of the task entity.
   */
  category: number;
}
