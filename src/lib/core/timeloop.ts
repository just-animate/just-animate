import { _ } from '../utils/constants'
import { push, includes, remove } from '../utils/lists'
import { dispatch } from '../store'
import { TICK } from '../actions'

const raf = requestAnimationFrame
const caf = cancelAnimationFrame
const now = () => performance.now()

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
    deltas[activeId] += delta

    // call sub with updated delta
    dispatch(TICK, activeId, delta)
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
  if (remove(active, id)) {
    delete deltas[id]
  }
  if (!active.length) {
    cancel()
  }
}
