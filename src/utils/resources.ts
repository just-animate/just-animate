export const _ = undefined as undefined

export const measureExpression = /^[ ]*([\-]{0,1}[0-9]*[\.]{0,1}[0-9]*){1}[ ]*([a-z%]+){0,1}$/i
export const unitExpression = /^[ ]*([+-][=]){0,1}[ ]*([\-]{0,1}[0-9]*[\.]{0,1}[0-9]+){1}[ ]*([a-z%]+){0,1}$/i

export const ALTERNATE = 'alternate'
export const CANCEL = 'cancel'
export const FATAL = 'fatal'
export const FINISH = 'finish'
export const FINISHED = 'finished'
export const IDLE = 'idle'
export const ITERATION = 'iteration'
export const NORMAL = 'normal'
export const PAUSE = 'pause'
export const PAUSED = 'paused'
export const PENDING = 'pending'
export const PLAY = 'play'
export const SEEK = 'seek'
export const UPDATE = 'update'
