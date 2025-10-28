import { InMemoryTaskRepository } from '../../src/infra/InMemoryTaskRepository';
import { TaskService } from '../../src/application/TaskService';

describe('TaskService (application layer)', () => {
  test('createTask persists task', async () => {
    const repo = new InMemoryTaskRepository();
    const service = new TaskService(repo);

    const t = await service.createTask('svc-1', 'Creare test');
    expect(t.id.toString()).toBe('svc-1');

    const loaded = await repo.findById('svc-1');
    expect(loaded).not.toBeNull();
    expect(loaded!.title.toString()).toBe('Creare test');
  });

  test('completeTask publishes domain events', async () => {
    const repo = new InMemoryTaskRepository();

    // mock publisher
    const published: any[] = [];
    const mockPublisher = {
      publish: jest.fn(async (ev: any) => published.push(ev))
    };

    const service = new TaskService(repo, mockPublisher);

    await service.createTask('svc-2', 'Da completare');
    await service.completeTask('svc-2');

    expect(mockPublisher.publish).toHaveBeenCalled();
    expect(published.length).toBe(1);
    expect(published[0].type).toBe('TaskCompleted');
    expect((published[0].payload as any).taskId).toBe('svc-2');

    // verify repository state
    const loaded = await repo.findById('svc-2');
    expect(loaded!.completed).toBe(true);
  });
});