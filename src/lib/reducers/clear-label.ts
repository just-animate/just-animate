import { ITimelineModel } from '../core/types'
import { IReducerContext } from '../core/types'
import { CONFIG } from '../utils/constants' 

export function clearLabel(model: ITimelineModel, name: string, ctx: IReducerContext) { 
  // set the label
  delete model.labels[name] 
  
  // trigger a config to let listeners know the configuration has changed
  ctx.trigger(CONFIG)
}
