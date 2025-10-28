import { Task } from '../domain/Task';
import { TaskId } from '../domain/TaskId';

export interface TaskRepository {
  save(task: Task): Promise<void>;
  findById(id: TaskId | string): Promise<Task | null>;
  findAll?(): Promise<Task[]>;
}