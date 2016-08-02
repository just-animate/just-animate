const now = (performance && performance.now) ? () => performance.now() : () => Date.now();

const raf = (window.requestAnimationFrame !== undefined)
    ? (ctx: any, fn: Function) => {
        window.requestAnimationFrame(() => { fn(ctx); });
    }
    : (ctx: any, fn: Function) => {
        setTimeout(() => { fn(ctx); }, 16.66);    
    };

export function createLoop(): ITimeLoop {
    const ctx: ITimeLoopContext = {
        active: [],
        elapses: [],
        isActive: false,
        lastTime: undefined,
        offs: [],
        ons: []
    };
    return {
        off: (fn: ITimeLoopCallback) => off(ctx, fn),
        on: (fn: ITimeLoopCallback) => on(ctx, fn)
    };
}

function on(self: ITimeLoopContext, fn: ITimeLoopCallback): void {
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
}
function off(self: ITimeLoopContext, fn: ITimeLoopCallback): void {  
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
        self.isActive = false;
        self.lastTime = undefined;
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
