import { TaskId } from './TaskId';
import { Title } from './Title';
import { DomainEvent } from './DomainEvent';

export class Task {
  private _completed: boolean;
  private _events: DomainEvent[] = [];

  constructor(
    public readonly id: TaskId,
    public title: Title,
    completed = false,
  ) {
    this._completed = completed;
  }

  get completed(): boolean { return this._completed; }

  complete(): void {
    if (this._completed) return; // idempotenza
    this._completed = true;
    this._events.push({
      type: 'TaskCompleted',
      occurredOn: new Date(),
      payload: { taskId: this.id.toString(), title: this.title.toString() },
    });
  }

  pullDomainEvents(): DomainEvent[] {
    const ev = [...this._events];
    this._events = [];
    return ev;
  }
}