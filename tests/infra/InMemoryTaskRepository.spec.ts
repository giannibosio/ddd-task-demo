import { InMemoryTaskRepository } from '../../src/infra/InMemoryTaskRepository';
import { Task } from '../../src/domain/Task';
import { TaskId } from '../../src/domain/TaskId';
import { Title } from '../../src/domain/Title';

describe('InMemoryTaskRepository', () => {
  test('save and findById roundtrip', async () => {
    const repo = new InMemoryTaskRepository();
    const task = new Task(new TaskId('repo-1'), new Title('Repo test'));
    await repo.save(task);

    const loaded = await repo.findById('repo-1');
    expect(loaded).not.toBeNull();
    expect(loaded!.id.toString()).toBe('repo-1');
    expect(loaded!.title.toString()).toBe('Repo test');
  });

  test('findById returns null if missing', async () => {
    const repo = new InMemoryTaskRepository();
    const loaded = await repo.findById('no-such-id');
    expect(loaded).toBeNull();
  });
});