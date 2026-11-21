import test from 'node:test';
import assert from 'node:assert/strict';
import { addTask, toggleTask, clearCompleted, getProgress, restoreTasks, createTaskId } from '../public/tasks.mjs';

test('task creation also works when secure-context UUID generation is unavailable', () => {
  assert.equal(createTaskId(() => 'secure-id'), 'secure-id');
  const id = createTaskId(null);
  assert.equal(addTask([], 'HTTP preview task', id)[0].id, id);
  assert.notEqual(createTaskId(null), id);
});

test('validation accepts the text boundary and rejects invalid persisted boundaries', () => {
  assert.equal(addTask([], 'x'.repeat(160), 'a')[0].text.length, 160);
  assert.throws(() => addTask([], 'Read', '   '), RangeError);
  assert.deepEqual(restoreTasks(JSON.stringify([{id:'a',text:'x'.repeat(161),completed:false}])), []);
  assert.equal(toggleTask([{id:'a',text:'Read',completed:true}], 'a')[0].completed, false);
});

test('add trims text, preserves source and assigns an unchecked ID', () => {
  const source = Object.freeze([]);
  assert.deepEqual(addTask(source, '  Ship a small thing  ', 'a'), [{id:'a',text:'Ship a small thing',completed:false}]);
  assert.equal(source.length, 0);
});
test('invalid text, IDs and capacity are rejected', () => {
  for (const text of ['', '   ', 'x'.repeat(161)]) assert.throws(() => addTask([],text,'a'), RangeError);
  for (const id of ['', null, 1]) assert.throws(() => addTask([],'Read',id), RangeError);
  assert.throws(() => addTask([{id:'a',text:'Read',completed:false}],'Write','a'), RangeError);
  const full = Array.from({length:100},(_,i)=>({id:String(i),text:'Task',completed:false}));
  assert.throws(() => addTask(full,'More','new'), RangeError);
});
test('toggle changes only the selected task and does not mutate it', () => {
  const tasks = Object.freeze([Object.freeze({id:'a',text:'Read',completed:false}),Object.freeze({id:'b',text:'Write',completed:false})]);
  const result = toggleTask(tasks,'a');
  assert.deepEqual(result,[{id:'a',text:'Read',completed:true},{id:'b',text:'Write',completed:false}]);
  assert.equal(tasks[0].completed,false);
  assert.deepEqual(toggleTask(tasks,'missing'),tasks);
});
test('clearing completed keeps unfinished tasks', () => {
  const tasks=[{id:'a',text:'Read',completed:true},{id:'b',text:'Write',completed:false}];
  assert.deepEqual(clearCompleted(tasks),[tasks[1]]);
  assert.equal(tasks.length,2);
});
test('progress handles empty and partial lists', () => {
  assert.deepEqual(getProgress([]),{completed:0,total:0,percent:0});
  assert.deepEqual(getProgress([{completed:true},{completed:false},{completed:true}]),{completed:2,total:3,percent:67});
});
test('restore is robust against corrupt and hostile-shaped data', () => {
  for(const input of ['{','null','{}','123',null,undefined]) assert.deepEqual(restoreTasks(input),[]);
  const input=[{id:'a',text:'  Read  ',completed:true},{id:'a',text:'Duplicate',completed:false},{id:'b',text:'Write',completed:'false'},{id:'c',text:' ',completed:false},{id:4,text:'Bad ID',completed:false},{id:'d',text:'<img src=x onerror=alert(1)>',completed:false},null];
  assert.deepEqual(restoreTasks(JSON.stringify(input)),[{id:'a',text:'Read',completed:true},{id:'d',text:'<img src=x onerror=alert(1)>',completed:false}]);
});
test('restore limits oversized stored lists', () => {
  const input=Array.from({length:120},(_,i)=>({id:String(i),text:'Task',completed:false}));
  assert.equal(restoreTasks(JSON.stringify(input)).length,100);
});
