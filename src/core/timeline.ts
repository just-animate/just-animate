import { REMOVE, ADD, REPLACE, IDLE } from '../_constants';
import {
    diff,
    copyInclude,
    pushAll,
    isString,
    $,
    copyExclude,
    keys
} from './utils';
import { dict } from './dict';
import { refs } from './refs';
import { middlewares } from './middleware';
import { timelines } from './timelines';
import { timer } from './timer';

export function Timeline(this: ja.ITimeline, options: ja.ITimelineOptions) {
    const self = this;
    self.state = {
        time: 0,
        rate: 1,
        state: IDLE,
        alternate: false,
        repeat: 1
    };

    self.duration = 0;
    self.animations = [];
    self.events = {};
    self.targets = {};

    options = options || {}
    self.labels = dict(options.labels);
    self.refs = dict(options.refs);

    self.tick = self.tick.bind(self);

    // register new timeline
    timelines.set(options.name, this);
}

Timeline.prototype.imports = function(
    this: ja.ITimeline,
    options: ja.ITimelineJSON
) {
    if (options.labels) {
        this.labels.import(options.labels);
    }
    if (options.targets) {
        updateTargets(this, options.targets);
    }
    return this;
};
Timeline.prototype.exports = function(this: ja.ITimeline): ja.ITimelineJSON {
    const self = this;
    return {
        duration: self.duration,
        labels: self.labels.export(),
        targets: self.targets
    };
};
Timeline.prototype.getState = function(this: ja.ITimeline) {
    return this.state;
};
Timeline.prototype.setState = function(
    this: ja.ITimeline,
    options: ja.ITimelineState
) {
    const self = this;
    // create new state
    const nextState = copyExclude(
        options,
        undefined,
        self.state
    ) as ja.ITimelineState;

    // process new time (should animation end if active)
    let shouldFireFinish;
    if (nextState.state === 'running') {
        const isForwards = nextState.rate >= 0;
        const duration = self.duration;
        if (isForwards && nextState.time >= duration) {
            nextState.time = duration;
            nextState.state = 'paused';
            shouldFireFinish = true;
        } else if (!isForwards && nextState.time <= 0) {
            nextState.time = 0;
            nextState.state = 'paused';
            shouldFireFinish = true;
        }
    }

    // if running and no tick subscription, get one
    if (!self._sub && nextState.state === 'running') {
        self._sub = timer.subscribe(self.tick);
    }
    // unsubscribe if we no longer need to receive new ticks
    if (self._sub && nextState.state !== 'running') {
        self._sub.unsubscribe();
        self._sub = undefined;
    }

    // if the state has changed at all, refresh animations
    self.animations.forEach(a => {
        a.updated(nextState);
    });

    self.emit('update');
    if (shouldFireFinish) {
        self.emit('finish');
    }
    return self;
};
Timeline.prototype.tick = function(this: ja.ITimeline, delta: number) {
    const state = this.state;
    this.seek(state.time + state.rate * delta);
};
Timeline.prototype.seek = function(
    this: ja.ITimeline,
    timeOrLabel: number | string
) {
    const self = this;

    self.setState({
        time: isString(timeOrLabel)
            ? self.labels.get(timeOrLabel as string)
            : (timeOrLabel as number)
    });

    return self;
};
Timeline.prototype.emit = function(this: ja.ITimeline, event: string) {
    const evt = this.events[event];
    if (evt) {
        const handlers = evt.slice();
        for (let i = 0, iLen = handlers.length; i < iLen; i++) {
            handlers[i]();
        }
    }
    return this;
};
Timeline.prototype.on = function(
    this: ja.ITimeline,
    event: string,
    listener: () => void
) {
    const evt = this.events[event] || (this.events[event] = []);
    if (evt.indexOf(listener) === -1) {
        evt.push(listener);
    }
    return this;
};
Timeline.prototype.off = function(
    this: ja.ITimeline,
    event: string,
    listener: () => void
) {
    const evt = this.events[event];
    if (evt) {
        const index = evt.indexOf(listener);
        if (index !== -1) {
            evt.splice(index, 1);
        }
    }
    return this;
};

function updateTargets(self: ja.ITimeline, targets: ja.ITargetJSON) {
    const changes = diff(self.targets, targets);
    if (changes) {
        self.targets = targets;
        self.emit('config');
        updateEffects(self, changes);
    }
}
function updateEffects(self: ja.ITimeline, changes: ja.ChangeSet) {
    const animations = self.animations;
    // remove if removed or replaced
    for (let i = animations.length - 1; i > -1; i--) {
        const animation = animations[i];
        const type = changes[animation.target];
        if (type === REMOVE || type === REPLACE) {
            animations.splice(i, 1);
            animation.destroyed();
        }
    }
    // add new effects
    for (let selector in changes) {
        const type = changes[selector];
        if (type === REMOVE) {
            // skip remove commands (they were already processed)
            continue;
        }

        const properties = self.targets[selector];

        // find the next set of properties to process
        let propertyJSON: ja.IPropertyJSON;
        if (type === ADD || type === REPLACE) {
            propertyJSON = properties;
        } else {
            propertyJSON = copyInclude(
                properties,
                keys(changes).filter(
                    p => changes[p] === ADD || changes[p] === REPLACE
                )
            );
        }
        // create all animations using middleware
        const newAnimations = createAnimations(self, selector, propertyJSON);
        if (newAnimations.length) {
            // if any animations were created, add them to the list of animations
            newAnimations.forEach(n => {
                n.created();
            });
            pushAll(animations, newAnimations);
        }
    }
}

function resolveSelectors(self: ja.ITimeline, selectors: string) {
    return selectors
        .split(',')
        .map(
            s =>
                isString(s) && s[0] === '@'
                    ? resolveRefs(self, s)
                    : $(self.el, s)
        );
}

function resolveRefs(self: ja.ITimeline, ref: string) {
    const refName = ref.substring(1);
    return self.refs.get(refName) || refs.get(refName);
}

function createAnimations(
    self: ja.ITimeline,
    selector: string,
    properties: ja.IPropertyJSON
) {
    const duration = self.duration;
    const targets = resolveSelectors(self, selector);
    const newAnimations: ja.IAnimation[] = [];

    for (let i = 0, tLen = targets.length; i < tLen; i++) {
        const target = targets[i];
        let handled: string[] = [];
        let props = properties;
        for (let m = 0, mLen = middlewares.length; m < mLen; m++) {
            // stop processing if we run out of properties to process
            if (!keys(props).length) {
                break;
            }
            // get animations
            const animations = middlewares[m]({
                target: target,
                duration: duration,
                props: props as any
            });

            if (!animations || !animations.length) {
                // quit earlier if this middleware did nothing
                continue;
            }

            pushAll(newAnimations, animations);

            // mark properties as handled
            handled = animations.map(selectProps).reduce(pushAll, handled);

            // exclude handled properties from next run
            props = copyExclude(props, handled);
        }
    }
    return newAnimations;
}

function selectProps(a: ja.IAnimation) {
    return a.props;
}
