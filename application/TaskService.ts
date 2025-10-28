import { Task } from '../domain/Task';
import { TaskId } from '../domain/TaskId';
import { Title } from '../domain/Title';
import { TaskRepository } from '../repositories/TaskRepository';
import { EventPublisher } from '../infra/SimpleEventPublisher';

export class TaskService {
  constructor(private repo: TaskRepository, private publisher?: EventPublisher) {}

  async createTask(id: string, titleText: string): Promise<Task> {
    const idVo = new TaskId(id);
    const title = new Title(titleText);
    const task = new Task(idVo, title);
    await this.repo.save(task);
    return task;
  }

  async completeTask(id: string): Promise<Task> {
    const task = await this.repo.findById(id);
    if (!task) throw new Error('Task not found');
    task.complete();
    await this.repo.save(task);

    if (this.publisher) {
      const events = task.pullDomainEvents();
      for (const ev of events) {
        await this.publisher.publish(ev);
      }
    }
    return task;
  }

  async listTasks(): Promise<Task[]> {
    if (typeof this.repo.findAll === 'function') {
      return this.repo.findAll!();
    }
    throw new Error('Repository does not support list');
  }
}