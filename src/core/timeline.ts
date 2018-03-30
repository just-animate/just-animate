import { ObservableProxy } from './observable-proxy';
import {
    $,
    copyExclude,
    copyInclude,
    diff,
    isString,
    keys,
    pushAll,
    isDefined
} from './utils';
import { ADD, IDLE, REMOVE, REPLACE } from '../_constants';
import { middlewares } from './middleware';
import { refs } from './refs';
import { timelines } from './timelines';
import { timer } from './timer';
import { types } from './types';

export class Timeline {
    /**
     * Containing element.  Used to narrow CSS selectors to a particular part of the document
     */
    public el: Element;
    /**
     * The duration of the timeline
     */
    public duration: number;
    /**
     * The current state of the timeline, DO NOT MODIFY!
     */
    public state: types.ITimelineState;
    /**
     * The current JSON configuration of targets
     */
    public targets: types.ITargetJSON;
    /**
     * THe list of active animations
     */
    public animations: types.IAnimation[];
    /**
     * Event listeners  Please use on/off/emit
     */
    public events: Record<string, (() => void)[]>;
    /**
     * Referenced elements/targets
     */
    public refs: types.ObservableProxy<{}>;
    /**
     * Named times
     */
    public labels: types.ObservableProxy<number>;

    public _sub: types.ISubscription;

    constructor(options: types.ITimelineOptions) {
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

        options = options || {};
        self.labels = ObservableProxy(options.labels);
        self.refs = ObservableProxy(options.refs);

        // register new timeline
        timelines[options.name] = self;
    }

    public import(options: Partial<types.ITimelineJSON>) {
        const self = this;
        let changes = 0;
        if (options.timing) {
            changes += updateTiming(self, options.timing)
        }
        if (options.labels) {
            for (const name in this.labels) {
                if (!isDefined(options.labels[name])) {
                    delete this.labels[name];
                }
            }
            for (const name in options.labels) {
                this.labels[name] = options.labels[name];
            }
            changes++;
        }
        if (options.targets) {
            changes += updateTargets(this, options.targets);
        }

        // if the configuration changed at all, emit the config event
        if (changes) {
            self.emit('config');
        }
        return self;
    }
    public export(): types.ITimelineJSON {
        const self = this;
        return {
            timing: {
                duration: self.duration
            },
            labels: self.labels,
            targets: self.targets
        };
    }
    public getState() {
        return this.state;
    }
    public setState(options: Partial<types.ITimelineState>) {
        const self = this;
        // create new state
        const nextState = copyExclude(
            options,
            undefined,
            self.state
        ) as types.ITimelineState;

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
    }
    public tick = (delta: number) => {
        const state = this.state;
        this.seek(state.time + state.rate * delta);
    };
    public seek(timeOrLabel: number | string) {
        const self = this;

        self.setState({
            time: isString(timeOrLabel)
                ? self.labels[timeOrLabel as string]
                : (timeOrLabel as number)
        });

        return self;
    }
    public emit(event: string) {
        const evt = this.events[event];
        if (evt) {
            const handlers = evt.slice();
            for (let i = 0, iLen = handlers.length; i < iLen; i++) {
                handlers[i]();
            }
        }
        return this;
    }
    public on(event: string, listener: () => void) {
        const evt = this.events[event] || (this.events[event] = []);
        if (evt.indexOf(listener) === -1) {
            evt.push(listener);
        }
        return this;
    }
    public off(event: string, listener: () => void) {
        const evt = this.events[event];
        if (evt) {
            const index = evt.indexOf(listener);
            if (index !== -1) {
                evt.splice(index, 1);
            }
        }
        return this;
    }
}

function updateTiming(self: Timeline, timing: types.ITimingJSON) {
    if (isDefined(timing.duration)) {
        self.duration = timing.duration;
        return 1
    }
    return 0;
}

function updateTargets(self: Timeline, targets: types.ITargetJSON) {
    const changes = diff(self.targets, targets);
    if (changes) {
        self.targets = targets;
        updateEffects(self, changes);
        return 1;
    }
    return 0;
}
function updateEffects(self: Timeline, changes: types.ChangeSet) {
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
        let propertyJSON: types.IPropertyJSON;
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

function resolveSelectors(self: Timeline, selectors: string) {
    return selectors
        .split(',')
        .map(
            s =>
                isString(s) && s[0] === '@'
                    ? resolveRefs(self, s)
                    : $(self.el, s)
        )
        .reduce(pushAll, []);
}

function resolveRefs(self: Timeline, ref: string) {
    const refName = ref.substring(1);
    return self.refs[refName] || refs[refName];
}

function createAnimations(
    self: Timeline,
    selector: string,
    properties: types.IPropertyJSON
) {
    const duration = self.duration;
    const targets = resolveSelectors(self, selector);
    const newAnimations: types.IAnimation[] = [];

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

function selectProps(a: types.IAnimation) {
    return a.props;
}
