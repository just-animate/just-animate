import { ITimelineModel } from '../core/types' 
import { unsubscribeAll } from '../core/events'
import { destroyModel } from '../model/store' 
import { cancel } from './cancel'

export const destroy = (model: ITimelineModel) => {
    cancel(model) 
    unsubscribeAll(model.id)
    destroyModel(model.id)
}
