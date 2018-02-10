import { IObserver, IObservable } from '../types'
import { toArray, addAll, removeAll } from './arrays';

/**
 * Creates a new observable.
 */
export function Observable<TValue>(options: { distinct: boolean }): IObservable<TValue> {
    const distinct = options.distinct !== false
    const subs: IObserver<TValue>[] = []

    let c: TValue
    let buffer: TValue[]

    return {
        value() {
            return c
        },
        dispose() {
            // clear subscribers
            subs.length = 0
        },
        next(n: TValue) {
            if (!buffer) {
                buffer = []
            }

            buffer.push(n)

            if (buffer.length > 1) {
                // if next is currently in progress, buffer
                return
            }

            for (let h = 0; h < buffer.length; h++) {
                // copy subscribers in case one subscriber unsubscribes a subsequent one
                const subs2 = subs.slice()
                n = buffer[h]

                // skip value if distinct is true and the same value is recorded from last time
                if (!distinct || n !== c) {
                    c = n
                    for (let i = 0; i < subs2.length; i++) {
                        subs2[i](n)
                    }
                }
            }

            // clear the buffer
            buffer.length = 0
        },
        subscribe(fn: IObserver<any>[]) {
            fn = toArray(fn)

            addAll(subs, fn)
            return () => { removeAll(subs, fn) }
        }
    }
}
