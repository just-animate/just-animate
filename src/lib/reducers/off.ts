import { IReducer, ITimelineModel, TimelineEvent } from '../core/types'
import { getIndex } from '../utils/lists'

export const off: IReducer = (model: ITimelineModel, data: any) => {
    const listeners = model.subs[data.name as TimelineEvent]
    if (listeners) {
      const indexOfListener = getIndex(listeners, data.fn)
      if (indexOfListener !== -1) {
        listeners.splice(indexOfListener, 1)
      }
    }
}
