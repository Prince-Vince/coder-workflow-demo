import { addTask, toggleTask, clearCompleted, getProgress, restoreTasks, createTaskId } from './tasks.mjs';

const STORAGE_KEY = 'small-wins-tasks';
const STORAGE_WARNING = 'Browser storage is unavailable. Changes may be lost on reload.';

const form = document.getElementById('task-form');
const input = document.getElementById('task-input');
const list = document.getElementById('task-list');
const progress = document.getElementById('progress');
const progressText = document.getElementById('progress-text');
const emptyState = document.getElementById('empty-state');
const clearButton = document.getElementById('clear-completed');
const message = document.getElementById('message');
const storageLabel = document.querySelector('.list-footer span');

let tasks = [];
let storageFailed = false;
try {
  tasks = restoreTasks(localStorage.getItem(STORAGE_KEY));
} catch {
  storageFailed = true;
}

function showMessage(detail = '') {
  const text = [detail, storageFailed ? STORAGE_WARNING : ''].filter(Boolean).join(' ');
  if (message.textContent !== text) message.textContent = text;
  storageLabel.textContent = storageFailed ? 'Browser storage unavailable' : 'Saved in this browser';
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    storageFailed = false;
  } catch {
    storageFailed = true;
  }
  showMessage();
}

function updateProgress() {
  const { completed, total, percent } = getProgress(tasks);
  progress.value = percent;
  progressText.textContent = `${completed} of ${total} complete`;
  emptyState.hidden = total > 0;
  clearButton.disabled = completed === 0;
}

function renderTasks() {
  const rows = document.createDocumentFragment();
  for (const task of tasks) {
    const row = document.createElement('li');
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    const text = document.createElement('span');

    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    text.textContent = task.text;
    checkbox.addEventListener('change', () => {
      tasks = toggleTask(tasks, task.id);
      saveTasks();
      updateProgress();
    });

    label.append(checkbox, text);
    row.append(label);
    rows.append(row);
  }
  list.replaceChildren(rows);
  updateProgress();
}

form.addEventListener('submit', event => {
  event.preventDefault();
  try {
    tasks = addTask(tasks, input.value, createTaskId());
  } catch (error) {
    input.setAttribute('aria-invalid', 'true');
    showMessage(error instanceof RangeError ? error.message : 'Could not add that task. Please try again.');
    input.focus();
    return;
  }
  input.value = '';
  input.removeAttribute('aria-invalid');
  saveTasks();
  renderTasks();
  input.focus();
});

clearButton.addEventListener('click', () => {
  tasks = clearCompleted(tasks);
  saveTasks();
  renderTasks();
  input.focus();
});

renderTasks();
showMessage();
