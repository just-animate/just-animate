import { ITimelineModel } from '../core/types' 
import { unsubscribeAll } from '../core/events'
import { destroyModel } from '../model/store' 
import { cancel } from './cancel'

export const destroy = (model: ITimelineModel) => {
    // cancel timeline to reset effects
    cancel(model) 
    
    // remove all subscriptions (so they don't attempt to look for this model)
    unsubscribeAll(model.id)
    
    // destroy the model (remove it from the list of available models)
    destroyModel(model.id)
}
