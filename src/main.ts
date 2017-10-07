import * as types from './lib/core/types'
import { timeline } from './lib/timeline'
import { addPlugin } from './lib/core/plugins'
import { dispatch, subscribe, unsubscribe, getState, getIds } from './lib/store'
import { propsPlugin } from './props' 

/** 
 * Returns a new timeline of animation(s) using the options provided
 * @param options Animtion options or an array of options
 */
export function animate(options?: types.AddAnimationOptions | types.AddAnimationOptions[]) {
  return timeline().add(options)
}

/**s
 * Returns a new sequence of animations in a timeline
 * @param seqOptions an array of animations options
 */
export function sequence(seqOptions: types.AddAnimationOptions[]) {
  return timeline().sequence(seqOptions)
}

// export utils and types
export { timeline, addPlugin }
export { removePlugin } from './lib/core/plugins'
export { interpolate } from './lib/core/interpolate'

// register props plugin
addPlugin(propsPlugin)

// add declaration to window
declare global {
  interface Window {
    just_devtools: {
      dispatch: typeof dispatch,
      subscribe: typeof subscribe,
      unsubscribe: typeof unsubscribe,
      getIds: typeof getIds,
      getState: typeof getState
    }
  }
}

// put devtools on window so tooling can attach
if (typeof window !== 'undefined') {
  window.just_devtools = {
    dispatch,
    subscribe,
    unsubscribe,
    getIds,
    getState
  }
}
