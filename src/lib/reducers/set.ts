import { BaseSetOptions, AnimationOptions, ITimelineModel } from '../core/types'
import { plugins } from '../core/plugins'
import { includes, list } from '../utils/lists'
import { _ } from '../utils/constants' 
import { insert } from './insert'
import { IReducerContext } from '../core/types'

export function set(model: ITimelineModel, options: BaseSetOptions | BaseSetOptions[], ctx: IReducerContext) {
    const pluginNames = Object.keys(plugins)
  
    const opts2 = list(options).map(opts => {
      const at = opts.at || model.cursor
      const opt2 = {} as AnimationOptions
  
      for (var name in opts) {
        if (includes(pluginNames, name)) {
          // if property is going to be handled by a plugin, replace each of its properties with an array with an empty spot
          // this empty will be resolved when the timeline creates effects
          const props = opts[name]
          const props2 = {} as typeof props
          for (var propName in props) {
            var value = props[propName]
            props2[propName] = [_, value]
          }
          opt2[name] = props2
        } else {
          opt2[name] = opts[name]
        }
      }
      // insert from (time - super small decimal) + the time specified, this should create a tween that is effectively
      // so small as to not occur in most cases.  This should "look like" setting it
      opt2.from = at - 0.000000001
      opt2.to = at
      return opt2
    })
  
    insert(model, opts2, ctx)
  }
