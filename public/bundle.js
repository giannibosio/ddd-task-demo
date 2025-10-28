// src/domain/Task.ts
var Task = class {
  constructor(id, title, completed = false) {
    this.id = id;
    this.title = title;
    this._events = [];
    this._completed = completed;
  }
  get completed() {
    return this._completed;
  }
  complete() {
    if (this._completed)
      return;
    this._completed = true;
    this._events.push({
      type: "TaskCompleted",
      occurredOn: /* @__PURE__ */ new Date(),
      payload: { taskId: this.id.toString(), title: this.title.toString() }
    });
  }
  pullDomainEvents() {
    const ev = [...this._events];
    this._events = [];
    return ev;
  }
};

// src/domain/TaskId.ts
var TaskId = class _TaskId {
  constructor(value) {
    if (!value || value.trim() === "")
      throw new Error("TaskId required");
    this._value = value;
    Object.freeze(this);
  }
  toString() {
    return this._value;
  }
  equals(other) {
    return other instanceof _TaskId && other._value === this._value;
  }
};

// src/domain/Title.ts
var Title = class _Title {
  constructor(text) {
    if (!text || text.trim().length === 0)
      throw new Error("Title cannot be empty");
    this._text = text.trim();
    Object.freeze(this);
  }
  toString() {
    return this._text;
  }
  equals(other) {
    return other instanceof _Title && other._text === this._text;
  }
};

// src/infra/InMemoryTaskRepository.ts
var InMemoryTaskRepository = class {
  constructor() {
    this.store = /* @__PURE__ */ new Map();
  }
  async save(task) {
    this.store.set(task.id.toString(), {
      id: task.id.toString(),
      title: task.title.toString(),
      completed: task.completed
    });
  }
  async findById(id) {
    const key = id instanceof TaskId ? id.toString() : String(id);
    const raw = this.store.get(key);
    if (!raw)
      return null;
    return new Task(new TaskId(raw.id), new Title(raw.title), raw.completed);
  }
  async findAll() {
    const res = [];
    for (const raw of this.store.values()) {
      res.push(new Task(new TaskId(raw.id), new Title(raw.title), raw.completed));
    }
    return res;
  }
};

// src/infra/SimpleEventPublisher.ts
var SimpleEventPublisher = class {
  async publish(event) {
    console.info("[DomainEvent]", event.type, JSON.stringify(event.payload));
  }
};

// src/application/TaskService.ts
var TaskService = class {
  constructor(repo, publisher) {
    this.repo = repo;
    this.publisher = publisher;
  }
  async createTask(id, titleText) {
    const idVo = new TaskId(id);
    const title = new Title(titleText);
    const task = new Task(idVo, title);
    await this.repo.save(task);
    return task;
  }
  async completeTask(id) {
    const task = await this.repo.findById(id);
    if (!task)
      throw new Error("Task not found");
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
  async listTasks() {
    if (typeof this.repo.findAll === "function") {
      return this.repo.findAll();
    }
    throw new Error("Repository does not support listing");
  }
};

// src/browser/index.ts
function template() {
  return `
  <div style="font-family:system-ui, -apple-system, 'Segoe UI', Roboto, Arial; padding:18px; max-width:900px;">
    <h1>DDD Task Demo (browser)</h1>
    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <input id="taskId" type="text" placeholder="id (es. task-1)" />
      <input id="taskTitle" type="text" placeholder="Titolo task" style="flex:1" />
      <button id="createBtn">Crea</button>
    </div>

    <h3>Tasks</h3>
    <ul id="tasksList"></ul>

    <div style="margin-top:18px;padding:10px;background:#f7f7f7;border-radius:6px;">
      <strong>Domain Events</strong>
      <div id="eventsLog" style="font-family:monospace;font-size:13px;margin-top:8px;max-height:200px;overflow:auto"></div>
    </div>
  </div>
  `;
}
document.addEventListener("DOMContentLoaded", async () => {
  document.body.innerHTML = template();
  const repo = new InMemoryTaskRepository();
  const eventsDiv = document.getElementById("eventsLog");
  const publisher = new SimpleEventPublisher();
  publisher.publish = async (ev) => {
    console.info("[DomainEvent]", ev);
    const node = document.createElement("div");
    node.textContent = `[${ev.type}] ${JSON.stringify(ev.payload)}`;
    if (eventsDiv.firstChild)
      eventsDiv.insertBefore(node, eventsDiv.firstChild);
    else
      eventsDiv.appendChild(node);
  };
  const service = new TaskService(repo, publisher);
  const tasksList = document.getElementById("tasksList");
  const createBtn = document.getElementById("createBtn");
  const inputId = document.getElementById("taskId");
  const inputTitle = document.getElementById("taskTitle");
  async function refreshUI() {
    const tasks = await service.listTasks();
    tasksList.innerHTML = "";
    tasks.sort((a, b) => a.id.toString().localeCompare(b.id.toString()));
    for (const t of tasks) {
      const li = document.createElement("li");
      li.style.marginBottom = "8px";
      li.className = t.completed ? "completed" : "";
      li.innerHTML = `<strong>${t.id.toString()}</strong> \u2014 ${t.title.toString()} `;
      if (!t.completed) {
        const btn = document.createElement("button");
        btn.textContent = "Completa";
        btn.onclick = async () => {
          try {
            await service.completeTask(t.id.toString());
            await refreshUI();
          } catch (err) {
            alert(err.message || String(err));
          }
        };
        li.appendChild(btn);
      } else {
        const span = document.createElement("span");
        span.style.marginLeft = "8px";
        span.textContent = "\u2705 completato";
        li.appendChild(span);
      }
      tasksList.appendChild(li);
    }
  }
  createBtn.addEventListener("click", async () => {
    const id = inputId.value.trim();
    const title = inputTitle.value.trim();
    if (!id || !title) {
      alert("Inserisci id e titolo");
      return;
    }
    try {
      await service.createTask(id, title);
      inputId.value = "";
      inputTitle.value = "";
      await refreshUI();
    } catch (err) {
      alert(err.message || String(err));
    }
  });
  try {
    await service.createTask("task-1", "Scrivere esempio DDD in TypeScript (browser)");
    await service.createTask("task-2", "Provare a completare task");
  } catch (e) {
  }
  await refreshUI();
});
//# sourceMappingURL=bundle.js.map
