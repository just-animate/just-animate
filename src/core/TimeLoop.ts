const now = (performance && performance.now) ? () => performance.now() : () => Date.now();
const raf = (window && window.requestAnimationFrame) || ((fn: Function) => setTimeout(fn, 16.66));

export interface ITimeLoopCallback {
    (delta: number, elapsed: number): any;
}

export class TimeLoop {
    private _isActive: boolean;
    private _lastTime: number;
    private _ons: ITimeLoopCallback[];
    private _offs: ITimeLoopCallback[];
    private _active: ITimeLoopCallback[];
    private _elapses: number[];

    constructor() {
        this._isActive = false;
        this._lastTime = undefined;
        this._ons = [];
        this._offs = [];
        this._active = [];
        this._elapses = [];

        this._update = this._update.bind(this);
    }

    public subscribe(fn: ITimeLoopCallback): void {
        const offIndex = this._offs.indexOf(fn);
        if (offIndex !== -1) {
            this._offs.splice(offIndex, 1);
        }
        if (this._ons.indexOf(fn) === -1) {
            this._ons.push(fn);
        }
        if (!this._isActive) {
            this._isActive = true;
            raf(this._update);
        }
    }
    public unsubscribe(fn: ITimeLoopCallback): void {
        const onIndex = this._ons.indexOf(fn);
        if (onIndex !== -1) {
            this._ons.splice(onIndex, 1);
        }
        if (this._offs.indexOf(fn) === -1) {
            this._offs.push(fn);
        }
        if (!this._isActive) {
            this._isActive = true;
            raf(this._update);
        }
    }
    private _update(): void {
        this._updateOffs();
        this._updateOns();

        const callbacks = this._active;
        const elapses = this._elapses;
        const len = callbacks.length;

        const lastTime = this._lastTime || now();
        const thisTime = now();
        const delta = thisTime - lastTime;

        // if nothing is subscribed, kill the cycle
        if (!len) {
            // end recursion
            this._isActive = false;
            this._lastTime = undefined;
            return;
        }

        // ensure running and requestAnimationFrame is called
        this._isActive = true;
        this._lastTime = thisTime;
        raf(this._update);

        for (let i = 0; i < len; i++) {
            // update delta and save result
            const existingElapsed = elapses[i];
            const updatedElapsed = existingElapsed + delta;
            elapses[i] = updatedElapsed;

            // call sub with updated delta
            callbacks[i](delta, updatedElapsed);
        }
    }
    private _updateOffs(): void {
        const len = this._offs.length;
        for (let i = 0; i < len; i++) {
            const fn = this._offs[i];
            const indexOfSub = this._active.indexOf(fn);
            if (indexOfSub !== -1) {
                this._active.splice(indexOfSub, 1);
                this._elapses.splice(indexOfSub, 1);
            }
        }
    }
    private _updateOns(): void {
        const len = this._ons.length;
        for (let i = 0; i < len; i++) {
            const fn = this._ons[i];
            if (this._active.indexOf(fn) === -1) {
                this._active.push(fn);
                this._elapses.push(0);
            }
        }
    }
}
