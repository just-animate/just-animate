import { caf, now, raf } from './utils'
import { _ } from './constants'
import { push, getIndex, includes } from './lists'

type TimeKeeper = { __last?: number }
const active: (TimeLoopCallback & TimeKeeper)[] = []

let lastHandle: number = _
let lastTime: number = _

export type TimeLoopCallback = (delta: number, elapsed: number) => any

function cancel() {
  caf(lastHandle)
  lastHandle = lastTime = _
}

function update() {
  const len = active.length
  lastTime = lastTime || now()

  // if not is subscribed, kill the cycle
  if (!len) {
    // end recursion
    cancel()
    return
  }

  const thisTime = now()
  const delta = thisTime - lastTime

  // ensure running and requestAnimationFrame is called
  lastTime = thisTime
  lastHandle = raf(update)

  for (let i = len - 1; i > -1; i--) {
    // update delta and save result
    const activeFn = active[i]
    const existingElapsed = activeFn.__last
    const updatedElapsed = existingElapsed + delta
    activeFn.__last = updatedElapsed

    // call sub with updated delta
    activeFn(delta, updatedElapsed)
  }
}

export function loopOn(fn: TimeLoopCallback) {
  if (!fn) {
    return
  }
 
  if (!includes(active, fn)) {
    const tk = fn as TimeKeeper
    tk.__last = 0
    push(active, fn)
  }

  if (!lastHandle) {
    lastHandle = raf(update)
  }
}

export function loopOff(fn: TimeLoopCallback) {
  if (!fn) {
    return
  }

  const indexOfSub = getIndex(active, fn)
  if (indexOfSub !== -1) {
    const tk = fn as TimeKeeper
    tk.__last = 0
    active.splice(indexOfSub, 1)
  }
  if (!active.length) {
    cancel()
  }
}
