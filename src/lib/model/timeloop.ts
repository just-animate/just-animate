import { caf, now, raf } from '../utils/utils'
import { _ } from '../utils/constants'
import { push, getIndex, includes } from '../utils/lists'
import { tick } from '../model/update'
 
const active: string[] = []
const deltas: Record<string, number> = {}

let lastHandle: number = _
let lastTime: number = _

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
    const activeId = active[i]
    const existingElapsed = deltas[activeId]
    const updatedElapsed = existingElapsed + delta
    deltas[activeId] = updatedElapsed

    // call sub with updated delta
    tick(activeId, updatedElapsed)
  }
}

export function loopOn(id: string) { 
  if (!includes(active, id)) {
    deltas[id] = 0 
    push(active, id)
  }

  if (!lastHandle) {
    lastHandle = raf(update)
  }
}

export function loopOff(id: string) { 
  const indexOfSub = getIndex(active, id)
  if (indexOfSub !== -1) {
    delete deltas[id]
    active.splice(indexOfSub, 1)
  }
  if (!active.length) {
    cancel()
  }
}
