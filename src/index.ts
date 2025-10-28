import { InMemoryTaskRepository } from './infra/InMemoryTaskRepository';
import { SimpleEventPublisher } from './infra/SimpleEventPublisher';
import { TaskService } from './application/TaskService';

async function main() {
  const repo = new InMemoryTaskRepository();
  const publisher = new SimpleEventPublisher();
  const service = new TaskService(repo, publisher);

  await service.createTask('task-1', 'Scrivere esempio DDD in TypeScript');
  await service.createTask('task-2', 'Provare a completare task');

  console.log('--- before complete ---');
  console.log(await service.listTasks());

  await service.completeTask('task-1');

  console.log('--- after complete ---');
  console.log(await service.listTasks());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});