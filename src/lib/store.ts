import { TimelineOptions, ITimelineModel } from './core/types'
import { _ } from './utils/constants'

import {
  CANCEL,
  CLEAR_LABEL,
  DESTROY,
  FINISH,
  PAUSE,
  PLAY,
  REVERSE,
  TICK,
  UPDATE,
  SEEK,
  UPDATE_RATE,
  APPEND,
  INSERT,
  SET,
  SET_LABEL,
  SET_REFS
} from './actions'

import {
  append,
  cancel,
  clearLabel,
  destroy,
  finish,
  insert,
  pause,
  play,
  reverse,
  set,
  setLabel,
  tick,
  update,
  updateRate,
  seek
} from './reducers/index'
import {
  IReducer,
  TimelineEvent,
  ITimelineEventListener,
  IReducerContext,
  IStore,
  TargetConfiguration
} from './core/types'
import { pushDistinct, all, remove } from './utils/lists'
import { calculateConfigs } from './reducers/calc-configs'
import { rebuild } from './reducers/rebuild'
import { setReferences } from './reducers/set-refs'

const stateSubs: ((type: string, store: IStore) => void)[] = []

const stores: Record<string, IStore> = {}

const reducers: Record<string, IReducer> = {
  [APPEND]: append,
  [CANCEL]: cancel,
  [CLEAR_LABEL]: clearLabel,
  [DESTROY]: destroy,
  [FINISH]: finish,
  [INSERT]: insert,
  [PAUSE]: pause,
  [PLAY]: play,
  [REVERSE]: reverse,
  [SEEK]: seek,
  [SET]: set,
  [SET_LABEL]: setLabel,
  [SET_REFS]: setReferences,
  [TICK]: tick,
  [UPDATE]: update,
  [UPDATE_RATE]: updateRate
}

let nextHandlerId = 0

function createInitial(opts: TimelineOptions) {
  const refs = {}
  if (opts.references) {
    for (var name in opts.references) {
      refs['@' + name] = opts.references[name]
    }
  }

  const newModel: ITimelineModel = {
    id: opts.id || _,
    cursor: 0,
    configs: [],
    labels: opts.labels || {},
    players: _,
    playerConfig: {
      repeat: _,
      yoyo: false
    },
    refs: refs,
    timing: {
      rate: 1,
      playing: false,
      active: false,
      round: _,
      time: _,
      duration: 0
    }
  }

  return newModel
}

export function getState(id: string) {
  return getStore(id).state
}

export function getStore(id: string) {
  const model = stores[id]
  if (!model) {
    throw new Error('not found')
  }
  return model
}

export function addStore(opts: { id?: string }) {
  stores[opts.id] = {
    state: createInitial(opts),
    subs: {} as Record<TimelineEvent, { handler: ITimelineEventListener; id: number }>
  }
}

export function on(id: string, eventName: string, handler: ITimelineEventListener, arg: any): number {
  const store = getStore(id)
  const subs = (store.subs[eventName] = store.subs[eventName] || [])
  const hid: number = handler._ja_id_ || (handler._ja_id_ = ++nextHandlerId)
  subs[hid] = { fn: handler, arg: arg }
  return hid
}

export function off(id: string, eventName: string, listener: ITimelineEventListener) {
  const store = getStore(id)
  const subs = store.subs[eventName]
  const hid: number = (listener as any)._ja_id_
  if (subs && hid) {
    subs[hid] = _
  }
}

export function dispatch(action: string, id: string, data?: any) {
  const fn = reducers[action]
  const store = getStore(id) 
  
  const ctx: IReducerContext = {
    events: [],
    needUpdate: [],
    trigger,
    dirty
  }

  const model = store.state

  // dispatch action
  fn(model, data, ctx)

  // handle all events produced from action chain
  all(ctx.events, evt => {
    const subs = store.subs[evt as TimelineEvent]
    if (subs) {
      for (var hid in subs) {
        var sub = subs[hid]
        if (sub) {
          sub.fn(sub.arg)
        }
      }
    }
  })
  
  if (ctx.destroyed) {
    // remove from stores if destroyed
    delete stores[id]
  } else if (ctx.needUpdate.length) {
    if (model.timing.active) {
      rebuild(model, ctx)
    } else {
      calculateConfigs(model)
    }
  }

  all(ctx.events, evt => {
    all(stateSubs, sub2 => {
      sub2(evt, store)
    })
  })
}

export function subscribe(fn: (type: string, store: IStore) => void) {
  pushDistinct(stateSubs, fn)
}

export function unsubscribe(fn: (type: string, store: IStore) => void) {
  remove(stateSubs, fn)
}

function trigger(this: IReducerContext, eventName: string) {
  pushDistinct(this.events, eventName)
}

function dirty(this: IReducerContext, config: TargetConfiguration) {
  pushDistinct(this.needUpdate, config)
}
