import { ITimelineModel, TimelineOptions } from '../core/types'
import { uuid } from '../utils/uuid'
import { S_INACTIVE, _ } from '../utils/constants'

const stores: Record<string, ITimelineModel> = {} 

export function createModel(opts: TimelineOptions): string {
    const id = uuid()
    stores[id] = createInitial(id, opts)
    return id
}

function createInitial(id: string, opts: TimelineOptions): ITimelineModel {
  const refs = {}
  if (opts.references) {
    for (var name in opts.references) {
      refs['@' + name] = opts.references[name]
    }
  }
  
  return {
    id: id, 
    duration: 0,
    cursor: 0,
    rate: 1,
    yoyo: false,
    state: S_INACTIVE,
    configs: [],
    players: _,
    repeat: _,
    round: _,
    refs: refs,
    time: _
  } 
}

export function getModel(id: string) {
  const model = stores[id]
  if (!model) { 
    throw new Error('Could not find timeline')
  }
  return model;
}

export function destroyModel(id: string) {
  delete stores[id] 
}
