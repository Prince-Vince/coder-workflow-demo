const MAX_TASKS = 100;
const MAX_TEXT_LENGTH = 160;

// IDs identify list items, not credentials; the fallback also works on HTTP previews.
export function createTaskId(randomUUID = globalThis.crypto?.randomUUID?.bind(globalThis.crypto)) {
  return randomUUID ? randomUUID() : `task-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

function isValidId(id) {
  return typeof id === 'string' && id.trim().length > 0;
}

function normalizeText(text) {
  if (typeof text !== 'string') return '';
  const trimmed = text.trim();
  return trimmed.length <= MAX_TEXT_LENGTH ? trimmed : '';
}

export function addTask(tasks, text, id) {
  const label = normalizeText(text);
  if (!label) throw new RangeError('Enter a task between 1 and 160 characters.');
  if (!isValidId(id) || tasks.some(task => task.id === id)) {
    throw new RangeError('Could not assign a unique task ID. Try again.');
  }
  if (tasks.length >= MAX_TASKS) throw new RangeError('Your list can hold up to 100 tasks.');

  return [...tasks, { id, text: label, completed: false }];
}

export function toggleTask(tasks, id) {
  const index = tasks.findIndex(task => task.id === id);
  if (index === -1) return tasks;
  return tasks.map((task, position) =>
    position === index ? { ...task, completed: !task.completed } : task
  );
}

export function clearCompleted(tasks) {
  return tasks.filter(task => !task.completed);
}

export function getProgress(tasks) {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  return { completed, total, percent: total ? Math.round(completed / total * 100) : 0 };
}

export function restoreTasks(json) {
  if (typeof json !== 'string') return [];
  let entries;
  try {
    entries = JSON.parse(json);
  } catch {
    return [];
  }
  if (!Array.isArray(entries)) return [];

  const tasks = [];
  const ids = new Set();
  for (const entry of entries) {
    if (!entry || typeof entry !== 'object') continue;
    const { id, text, completed } = entry;
    const label = normalizeText(text);
    if (!isValidId(id) || ids.has(id) || !label || typeof completed !== 'boolean') continue;

    ids.add(id);
    tasks.push({ id, text: label, completed });
    if (tasks.length === MAX_TASKS) break;
  }
  return tasks;
}
