import {IEventDispatcher, IConsumer, ILookup, ICallbackHandler} from './types';
import {multiapply} from './helpers';

export class EventDispatcher implements IEventDispatcher {
    private eventListeners: ILookup<IConsumer<any>[]> = {};
    
    on(eventName: string, eventListener: IConsumer<any[]>) {
        let eventListenerGroup = this.eventListeners[eventName];
        if (eventListenerGroup === undefined) {
            eventListenerGroup = [];
            this.eventListeners[eventName] = eventListenerGroup;
        }
        eventListenerGroup.push(eventListener);
    }
    off(eventName: string, eventListener: IConsumer<any[]>) {
        const eventListenerGroup = this.eventListeners[eventName];
        if (eventListenerGroup === undefined) {
            return;
        }
        let index = eventListenerGroup.indexOf(eventListener);
        if (index === -1) {
            return;
        }
        eventListenerGroup.splice(index, 1);
    }
    dispatch(eventName: string, args?: any[], cb?: ICallbackHandler) {
        const eventListenerGroup = this.eventListeners[eventName];
        if (eventListenerGroup === undefined && eventListenerGroup.length === 0) {
            return;
        }
        multiapply(eventListenerGroup, undefined, [args], cb);
    }
}