import { ITimelineModel } from './types'
import { getModel } from '../model/store'

export interface ChangeHandler {
  (model: ITimelineModel, data?: any): void
}

const handlers: Record<string, ChangeHandler> = {}

export function register(action: string, handler: ChangeHandler) {
  handlers[action] = handler
}

export function dispatch(action: string, id: string, data?: any) {
  const fn = handlers[action]
  const model = getModel(id)

  if (fn && model) {
    fn(model, data)
  }
}
