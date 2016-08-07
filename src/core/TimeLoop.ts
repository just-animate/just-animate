import {nothing} from '../helpers/resources';

const now = (performance && performance.now) ? () => performance.now() : () => Date.now();

const raf = (window.requestAnimationFrame !== nothing)
    ? (ctx: any, fn: Function) => {
        window.requestAnimationFrame(() => { fn(ctx); });
    }
    : (ctx: any, fn: Function) => {
        setTimeout(() => { fn(ctx); }, 16.66);    
    };

export function TimeLoop(): ITimeLoop {
    const self = this instanceof TimeLoop ? this : Object.create(TimeLoop.prototype);
    self.active = [];
    self.elapses = [];
    self.isActive = nothing;
    self.lastTime = nothing;
    self.offs = [];
    self.ons = [];
    return self;
}

TimeLoop.prototype = {
    on(fn: ITimeLoopCallback): void {
        const self = this;
        const offIndex = self.offs.indexOf(fn);
        if (offIndex !== -1) {
            self.offs.splice(offIndex, 1);
        }
        if (self.ons.indexOf(fn) === -1) {
            self.ons.push(fn);
        }
        if (!self.isActive) {
            self.isActive = true;
            raf(self, update);
        }
    },
    off(fn: ITimeLoopCallback): void {
        const self = this;
        const onIndex = self.ons.indexOf(fn);
        if (onIndex !== -1) {
            self.ons.splice(onIndex, 1);
        }
        if (self.offs.indexOf(fn) === -1) {
            self.offs.push(fn);
        }
        if (!self.isActive) {
            self.isActive = true;
            raf(self, update);
        }
    }
};


function update(self: ITimeLoopContext): void {
    updateOffs(self);
    updateOns(self);

    const callbacks = self.active;
    const elapses = self.elapses;
    const len = callbacks.length;

    const lastTime = self.lastTime || now();
    const thisTime = now();
    const delta = thisTime - lastTime;

    // if nothing is subscribed, kill the cycle
    if (!len) {
        // end recursion
        self.isActive = nothing;
        self.lastTime = nothing;
        return;
    }

    // ensure running and requestAnimationFrame is called
    self.isActive = true;
    self.lastTime = thisTime;
    raf(self, update);

    for (let i = 0; i < len; i++) {
        // update delta and save result
        const existingElapsed = elapses[i];
        const updatedElapsed = existingElapsed + delta;
        elapses[i] = updatedElapsed;

        // call sub with updated delta
        callbacks[i](delta, updatedElapsed);
    }
}

function updateOffs(self: ITimeLoopContext): void {
    const len = self.offs.length;
    for (let i = 0; i < len; i++) {
        const fn = self.offs[i];
        const indexOfSub = self.active.indexOf(fn);
        if (indexOfSub !== -1) {
            self.active.splice(indexOfSub, 1);
            self.elapses.splice(indexOfSub, 1);
        }
    }
}
function updateOns(self: ITimeLoopContext): void {
    const len = self.ons.length;
    for (let i = 0; i < len; i++) {
        const fn = self.ons[i];
        if (self.active.indexOf(fn) === -1) {
            self.active.push(fn);
            self.elapses.push(0);
        }
    }
}

export interface ITimeLoopCallback {
    (delta: number, elapsed: number): any;
}

export interface ITimeLoop {
    on(fn: ITimeLoopCallback): void;
    off(fn: ITimeLoopCallback): void;
}

interface ITimeLoopContext {
    isActive: boolean;
    lastTime: number;
    ons: ITimeLoopCallback[];
    offs: ITimeLoopCallback[];
    active: ITimeLoopCallback[];
    elapses: number[];
}
