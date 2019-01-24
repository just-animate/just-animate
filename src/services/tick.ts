const tasks: Array<(tick: number) => boolean> = [];

let promise: Promise<void> | 0;
let done: Function | 0;
let taskId: number;

export function nextAnimationFrame() {
  if (!promise) {
    // If we haven't used a promise, this frame, create one.
    promise = new Promise(resolve => {
      done = resolve;
    });
  }
  if (!taskId) {
    // For consistency, simply asking for the nextAnimationFrame schedules
    // a tick if one isn't already scheduled.
    taskId = requestAnimationFrame(updateAll);
  }
  return promise;
}

export function tick(task: (tick: number) => boolean) {
  if (tasks.indexOf(task) === -1) {
    // If this task isn't already in the list, add it.
    tasks.push(task);
  }
  if (!taskId) {
    // If a tick isn't scheduled, schedule it.
    taskId = requestAnimationFrame(updateAll);
  }
}

function updateAll() {
  // Grab the current time so we can consistently provide a frame time to all
  // animations if they need a time.
  const tick = performance.now();
  for (let i = 0; i < tasks.length; i++) {
    // Call the update function. Functions that return truthy stay in queue.
    const stayInQueue = tasks[i](tick);
    if (!stayInQueue) {
      // Remove update functions that returned falsey values.
      tasks.splice(i, 1);
      i--;
    }
  }

  // If there are any tasks in queue, schedule next frame.
  taskId = tasks.length ? requestAnimationFrame(updateAll) : 0;

  if (done) {
    // If nextAnimationFrame() was called, resolve the promise to notify
    // all interested parties. We have to store the done call in a local
    // variable in case the code executed by then wants to reschedule another
    // event. In that case, we need a new promise, so we have to store it,
    // unassign it, and then resolve it.
    const done2 = done;
    done = 0;
    promise = 0;
    done2();
  }
}
