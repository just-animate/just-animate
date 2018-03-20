import { types } from './types';

export class Observable<TValue> implements types.IObservable<TValue> {
    public subs: types.IObserver<TValue>[] = [];
    public buffer: TValue[] = [];

    public next( n: TValue) {
        const self = this;
        const buffer = self.buffer;
        buffer.push(n);
    
        if (buffer.length > 1) {
            // if next is currently in progress, buffer
            return;
        }
    
        for (let h = 0; h < buffer.length; h++) {
            // copy subscribers in case one subscriber unsubscribes a subsequent one
            const subs2 = self.subs.slice();
            n = buffer[h];
    
            // skip value if distinct is true and the same value is recorded from last time
            for (let i = 0; i < subs2.length; i++) {
                subs2[i](n);
            }
        }
    
        // clear the buffer
        buffer.length = 0;
    }
    public subscribe(fn: types.IObserver<TValue>) {
        const subs = this.subs;
        subs.push(fn);
        return {
            unsubscribe() {
                const index = subs.indexOf(fn);
                if (index !== -1) {
                    subs.splice(index, 1);
                }
            }
        };
    }
}
