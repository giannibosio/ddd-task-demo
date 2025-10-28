import { TaskRepository } from '../repositories/TaskRepository';
import { Task } from '../domain/Task';
import { TaskId } from '../domain/TaskId';
import { Title } from '../domain/Title';

export class InMemoryTaskRepository implements TaskRepository {
  private store = new Map<string, { id: string; title: string; completed: boolean }>();

  async save(task: Task): Promise<void> {
    this.store.set(task.id.toString(), {
      id: task.id.toString(),
      title: task.title.toString(),
      completed: task.completed
    });
  }

  async findById(id: TaskId | string): Promise<Task | null> {
    const key = id instanceof TaskId ? id.toString() : String(id);
    const raw = this.store.get(key);
    if (!raw) return null;
    return new Task(new TaskId(raw.id), new Title(raw.title), raw.completed);
  }

  async findAll(): Promise<Task[]> {
    const res: Task[] = [];
    for (const raw of this.store.values()) {
      res.push(new Task(new TaskId(raw.id), new Title(raw.title), raw.completed));
    }
    return res;
  }
}