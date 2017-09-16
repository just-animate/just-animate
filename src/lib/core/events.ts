import { pushDistinct, getIndex, all } from '../utils/lists'

const handlers = {}

export function publish(id: string, eventName: string, data: any) {
  const subscribers = handlers[id]
  if (subscribers) {
    all(subscribers[eventName], s => {
      s(data)
    })
  }
}

export function subscribe(id: string, eventName: string, listener: (data: any) => void) {
  const subscribers = handlers[id] || (handlers[id] = {})
  pushDistinct(subscribers[eventName] || (subscribers[eventName] = []), listener)
}

export function unsubscribeAll(id: string) {
  delete handlers[id]
}

export function unsubscribe(id: string, eventName: string, listener: (data: any) => void) {
  const subscribers = handlers[id]
  if (subscribers) {
    const listeners = subscribers[eventName]
    if (listeners) {
      const indexOfListener = getIndex(listeners, listener)
      if (indexOfListener !== -1) {
        listeners.splice(indexOfListener, 1)
      }
    }
  }
}
