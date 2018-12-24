import { TimelineOptions, ITimelineModel } from './core/types';
import { S_INACTIVE, _ } from './utils/constants';

import {
  CANCEL,
  DESTROY,
  FINISH,
  PAUSE,
  PLAY,
  REVERSE,
  TICK,
  UPDATE,
  UPDATE_TIME,
  UPDATE_RATE,
  APPEND,
  INSERT,
  SET
} from './actions';

import {
  append,
  cancel,
  destroy,
  finish,
  insert,
  pause,
  play,
  reverse,
  set,
  tick,
  update,
  updateRate,
  updateTime
} from './reducers/index';
import {
  IReducer,
  TimelineEvent,
  ITimelineEventListener,
  IReducerContext,
  IStore,
  TargetConfiguration
} from './core/types';
import { pushDistinct, all, remove } from './utils/lists';
import { calculateConfigs } from './reducers/calc-configs';
import { rebuild } from './reducers/rebuild';

const stateSubs: ((store: IStore) => void)[] = [];

const stores: Record<string, IStore> = {};

const reducers: Record<string, IReducer> = {
  [APPEND]: append,
  [CANCEL]: cancel,
  [DESTROY]: destroy,
  [FINISH]: finish,
  [INSERT]: insert,
  [PAUSE]: pause,
  [PLAY]: play,
  [REVERSE]: reverse,
  [SET]: set,
  [TICK]: tick,
  [UPDATE]: update,
  [UPDATE_RATE]: updateRate,
  [UPDATE_TIME]: updateTime
};

function createInitial(opts: TimelineOptions) {
  const refs = {};
  if (opts.references) {
    for (var name in opts.references) {
      refs['@' + name] = opts.references[name];
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
    time: _,
    yoyo: false
  };

  return newModel;
}

export function getState(id: string) {
  const model = stores[id];
  if (!model) {
    throw new Error('not found');
  }
  return model.state;
}

export function addState(opts: { id?: string }) {
  stores[opts.id] = {
    state: createInitial(opts),
    subs: {} as Record<TimelineEvent, ITimelineEventListener[]>
  };
}

export function on(
  id: string,
  eventName: string,
  listener: ITimelineEventListener
) {
  const store = stores[id];
  if (store) {
    const subs = (store.subs[eventName] = store.subs[eventName] || []);
    pushDistinct(subs, listener);
  }
}

export function off(
  id: string,
  eventName: string,
  listener: ITimelineEventListener
) {
  const store = stores[id];
  if (store) {
    remove(store.subs[eventName], listener);
  }
}

export function dispatch(action: string, id: string, data?: any) {
  const fn = reducers[action];
  const store = stores[id];

  if (!fn || !store) {
    throw new Error('not found');
  }

  const ctx: IReducerContext = {
    events: [],
    needUpdate: [],
    trigger,
    dirty
  };

  const model = store.state;

  // dispatch action
  fn(model, data, ctx);

  // handle all events produced from action chain
  all(ctx.events, evt => {
    const subs = store.subs[evt as TimelineEvent];
    if (subs) {
      all(subs, sub => {
        sub(model.time);
      });
    }
  });

  if (ctx.destroyed) {
    // remove from stores if destroyed
    delete stores[id];
  } else if (ctx.needUpdate.length) {
    if (model.state !== S_INACTIVE) {
      rebuild(model, ctx);
    } else {
      calculateConfigs(model);
    }

    // dispatch change event to global listeners
    all(stateSubs, sub => {
      sub(store);
    });
  }
}

function trigger(this: IReducerContext, eventName: string) {
  pushDistinct(this.events, eventName);
}

function dirty(this: IReducerContext, config: TargetConfiguration) {
  pushDistinct(this.needUpdate, config);
}

if (typeof window !== 'undefined') {
  (window as any).just_devtools = {
    dispatch,
    subscribe(fn: (store: IStore) => void) {
      pushDistinct(stateSubs, fn);
    },
    unsubscribe(fn: (store: IStore) => void) {
      remove(stateSubs, fn);
    }
  };
}
