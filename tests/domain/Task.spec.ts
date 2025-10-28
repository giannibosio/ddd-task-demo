import { Task } from '../../src/domain/Task';
import { TaskId } from '../../src/domain/TaskId';
import { Title } from '../../src/domain/Title';

describe('Task (Entity / Aggregate)', () => {
  test('complete sets completed true and emits TaskCompleted event', () => {
    const task = new Task(new TaskId('t-1'), new Title('Prova'), false);

    expect(task.completed).toBe(false);

    task.complete();

    expect(task.completed).toBe(true);
    const events = task.pullDomainEvents();
    expect(events.length).toBe(1);
    expect(events[0].type).toBe('TaskCompleted');
    expect((events[0].payload as any).taskId).toBe('t-1');
  });

  test('complete is idempotent (no duplicate events)', () => {
    const task = new Task(new TaskId('t-2'), new Title('Idempotenza'));
    task.complete();
    // pull events once
    const ev1 = task.pullDomainEvents();
    expect(ev1.length).toBe(1);
    // calling complete again should not add new events
    task.complete();
    const ev2 = task.pullDomainEvents();
    expect(ev2.length).toBe(0);
  });
});