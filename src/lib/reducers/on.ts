import { IReducer, ITimelineModel, TimelineEvent } from '../core/types'
import { pushDistinct } from '../utils/lists'

export const on: IReducer = (model: ITimelineModel, data: any) => {
    const name = data.name as TimelineEvent
    const subs = model.subs
    pushDistinct(subs[name] || (subs[name] = []), data.fn)
}
