import { all } from '../utils/lists'
import { ITimelineModel, TimelineEvent } from '../core/types'

export function publish(model: ITimelineModel, eventName: TimelineEvent, data: any) {
  all(model.subs[eventName], s => {
    s(data)
  })
}
