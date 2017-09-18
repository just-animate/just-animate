import { ITimelineModel } from '../core/types'  
import { cancel } from './cancel'
import { removeState } from '../store'
import { IReducer, IReducerContext } from '../core/types'
import { _ } from '../utils/constants'

export const destroy: IReducer = (model: ITimelineModel, _data: any, _ctx: IReducerContext) => {
    // cancel timeline to reset effects
    cancel(model, _, _ctx) 
    
    // destroy the model (remove it from the list of available models)
    // note: this creates a cycle of dependencies
    removeState(model.id)
}
