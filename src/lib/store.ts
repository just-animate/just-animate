import { TimelineOptions, ITimelineModel } from './core/types'
import { S_INACTIVE, _ } from './utils/constants'

import {
  CANCEL,
  DESTROY,
  FINISH,
  OFF,
  ON,
  PAUSE,
  PLAY,
  REVERSE,
  SETUP,
  TICK,
  UPDATE,
  UPDATE_TIME,
  UPDATE_RATE,
  APPEND,
  INSERT,
  SET
} from './actions'

import {
  append,
  cancel,
  destroy,
  finish,
  insert,
  off,
  on,
  pause,
  play,
  reverse,
  set,
  setup,
  tick,
  update,
  updateRate,
  updateTime
} from './reducers/index'
import { IReducer, TimelineEvent, ITimelineEventListener } from './core/types'

const stores: Record<string, ITimelineModel> = {}
const handlers: Record<string, IReducer> = {}

function createInitial(opts: TimelineOptions) {
  const refs = {}
  if (opts.references) {
    for (var name in opts.references) {
      refs['@' + name] = opts.references[name]
    }
  }

  const newModel: ITimelineModel = {
    configs: [],
    cursor: 0,
    duration: 0,
    id: opts.id,
    players: _,
    rate: 1,
    refs: refs,
    repeat: _,
    round: _,
    state: S_INACTIVE,
    subs: {} as Record<TimelineEvent, ITimelineEventListener[]>,
    time: _,
    yoyo: false
  }

  return newModel
}

export function getState(id: string) {
  const model = stores[id]
  if (!model) {
    throw new Error('timeline not found')
  }
  return model
}

export function addState(opts: { id?: string }) {
  stores[opts.id] = createInitial(opts)
}

export function removeState(id: string) {
  delete stores[id]
}

export function dispatch(action: string, id: string, data?: any) {
  const fn = handlers[action]
  const model = getState(id)

  if (fn && model) {
    fn(model, data)
  }
}

export function addReducer(action: string, handler: IReducer) {
  handlers[action] = handler
}

addReducer(APPEND, append)
addReducer(CANCEL, cancel)
addReducer(DESTROY, destroy)
addReducer(FINISH, finish)
addReducer(INSERT, insert)
addReducer(ON, on)
addReducer(OFF, off)
addReducer(PAUSE, pause)
addReducer(PLAY, play)
addReducer(REVERSE, reverse)
addReducer(SET, set)
addReducer(SETUP, setup)
addReducer(TICK, tick)
addReducer(UPDATE, update)
addReducer(UPDATE_RATE, updateRate)
addReducer(UPDATE_TIME, updateTime)
