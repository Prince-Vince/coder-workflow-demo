# Checklist acceptance criteria

The user wants to make a short list and see how much is done.

1. Adding a trimmed, nonempty task gives it a unique ID and an unchecked state. Reject blank text and more than 160 characters. Keep at most 100 tasks.
2. A checkbox toggles exactly one task by ID without mutating the original task array. Unknown IDs do nothing.
3. The progress display reads completed and total counts; an empty list is 0 of 0 and 0 percent.
4. Clear completed removes only completed tasks.
5. Tasks survive a page reload through localStorage. Corrupt JSON or invalid entries are discarded safely; duplicate IDs are rejected. Only valid string IDs, text and boolean completion states are restored.
6. Browser code inserts task labels as text, never HTML. The form works with Enter; controls have accessible labels; status changes are announced politely.
7. localStorage failure shows a short warning and still permits in-memory task use.
8. The layout works at 390px and desktop widths. Links and scripts work under a GitHub Pages subpath.

Export these functions from public/tasks.mjs: addTask(tasks, text, id), toggleTask(tasks, id), clearCompleted(tasks), getProgress(tasks), restoreTasks(json).

addTask throws RangeError for blank/too-long text, duplicate/invalid ID or the 100-task cap. All functions are immutable. restoreTasks returns an array and never throws for malformed input.
