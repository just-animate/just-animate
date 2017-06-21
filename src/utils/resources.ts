export const _ = undefined as undefined

export const camelCaseRegex = /([a-z])[- ]([a-z])/ig,
    measureExpression = /^[ ]*([\-]{0,1}[0-9]*[\.]{0,1}[0-9]*){1}[ ]*([a-z%]+){0,1}$/i,
    unitExpression = /^[ ]*([+-][=]){0,1}[ ]*([\-]{0,1}[0-9]*[\.]{0,1}[0-9]+){1}[ ]*([a-z%]+){0,1}$/i
export const ALTERNATE = 'alternate',
    CANCEL = 'cancel',
    FATAL = 'fatal',
    FINISH = 'finish',
    FINISHED = 'finished',
    IDLE = 'idle',
    ITERATION = 'iteration',
    NORMAL = 'normal',
    PAUSE = 'pause',
    PAUSED = 'paused',
    PENDING = 'pending',
    PLAY = 'play',
    RUNNING = 'running',
    UPDATE = 'update'
