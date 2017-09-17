import { ITimelineModel } from '../core/types'  
import { cancel } from './cancel'
import { removeState } from '../store'
import { IReducer } from '../core/types'

export const destroy: IReducer = (model: ITimelineModel) => {
    // cancel timeline to reset effects
    cancel(model) 
    
    // destroy the model (remove it from the list of available models)
    // note: this creates a cycle of dependencies
    removeState(model.id)
}
