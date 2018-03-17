import {
    IAnimation,
    ITimeline,
    ITimelineJSON,
    ITimelineOptions,
    ITimelineState,
    ITargetJSON,
    ChangeSet,
    IPropertyJSON
} from '../types';

import { REMOVE, ADD, REPLACE, IDLE } from '../_constants';

const JA = window.JA;
const {
    diff,
    isDefined,
    isString,
    $,
    pushAll,
    copyInclude,
    copyExclude
} = JA.utils;

function Timeline(this: ITimeline, options: ITimelineOptions) {
    const self = this;
    if (!(self instanceof Timeline)) {
        return new (Timeline as any)(options);
    }
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

    self.refs = JA.dict<{}>((values, set) => {
        for (let key in values) {
            set(key, values[key]);
        }
    });

    // register new timeline
    JA.timelines.set(options.name, this);
}

Timeline.prototype.imports = function(options: ITimelineJSON) {
    if (options.labels) {
        this.labels = options.labels;
    }
    if (options.targets) {
        updateTargets(this, options.targets);
    }
    return this;
};
Timeline.prototype.exports = function(): ITimelineJSON {
    return {
        duration: this.duration,
        targets: this.targets,
        labels: this.labels
    };
};
Timeline.prototype.getState = function() {
    return this.state;
};
Timeline.prototype.setState = function(state: ITimelineState) {
    updateState(this, state);
    return this;
};
Timeline.prototype.emit = function(event: string) {
    const evt = this._events[event];
    if (evt) {
        const handlers = evt.slice();
        for (let i = 0, iLen = handlers.length; i < iLen; i++) {
            handlers[i]();
        }
    }
    return this;
};
Timeline.prototype.on = function(event: string, listener: () => void) {
    const evt = this._events[event] || (this._events[event] = []);
    if (evt.indexOf(listener) === -1) {
        evt.push(listener);
    }
    return this;
};
Timeline.prototype.off = function(event: string, listener: () => void) {
    const evt = this._events[event];
    if (evt) {
        const index = evt.indexOf(listener);
        if (index !== -1) {
            evt.splice(index, 1);
        }
    }
    return this;
};

function updateTargets(self: ITimeline, targets: ITargetJSON) {
    const changes = diff(self.targets, targets);
    if (changes) {
        self.targets = targets;
        self.emit('config');
        updateEffects(self, changes);
    }
}
function updateState(self: ITimeline, options: Partial<ITimelineState>) {
    const state = self.state;
    // update player state
    let changed: number;
    for (let name in state) {
        if (isDefined(options[name]) && state[name] !== options[name]) {
            changed = 1;
            state[name] = options[name];
        }
    }

    // if the state has changed at all, refresh animations
    if (changed) {
        self.emit('update');
        self.animations.forEach(a => {
            a.updated(state);
        });
    }
}
function updateEffects(self: ITimeline, changes: ChangeSet) {
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
        let propertyJSON: IPropertyJSON;
        if (type === ADD || type === REPLACE) {
            propertyJSON = properties;
        } else {
            propertyJSON = copyInclude(
                properties,
                Object.keys(changes).filter(
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

function resolveSelectors(self: ITimeline, selectors: string) {
    return selectors
        .split(',')
        .map(
            s =>
                isString(s) && s[0] === '@'
                    ? resolveRefs(self, s)
                    : $(self.el, s)
        );
}

function resolveRefs(self: ITimeline, ref: string) {
    const refName = ref.substring(1);
    return self.refs.get(refName) || JA.refs.get(refName);
}

function createAnimations(
    self: ITimeline,
    selector: string,
    properties: IPropertyJSON
) {
    const middlewares = JA.middlewares;
    const duration = self.duration;
    const targets = resolveSelectors(self, selector);
    const newAnimations: IAnimation[] = [];

    for (let i = 0, tLen = targets.length; i < tLen; i++) {
        const target = targets[i];
        let handled: string[] = [];
        let props = properties;
        for (let m = 0, mLen = middlewares.length; m < mLen; m++) {
            // stop processing if we run out of properties to process
            if (!Object.keys(props).length) {
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

function selectProps(a: IAnimation) {
    return a.props;
}

// export out to window
JA.Timeline = (Timeline as any) as ITimeline;

declare module '../types' {
    interface JustAnimateStatic {
        Timeline: ITimeline;
    }
}
