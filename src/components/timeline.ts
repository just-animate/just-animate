import { ja } from '../types';
import { queueTransition } from '../services/animator';
import { FINISH, RUNNING, CANCEL, PAUSED } from '../utils/playStates';

let autoNumber = 0;

export class Timeline {
  /**
   * A unique identifier for the timeline.
   * @public
   */
  id: string;

  /**
   * True if the timeline should alternate.
   * @public
   */
  alternate: boolean;

  /**
   * The current time of the timeline. When using multiple iterations, this
   * represents the actual time, not the time of the iteration.
   * @public
   */
  currentTime: number;

  /**
   * The duration of one iteration of the Animation.
   * @public
   */
  get duration() {
    let duration = 0;
    // Walk through all keyframes and determine the longest duration.
    // tslint:disable-next-line:forin
    for (const targetName in this.keyframes) {
      const target = this.keyframes[targetName];
      // tslint:disable-next-line:forin
      for (const propName in target) {
        for (const time in target[propName]) {
          if (duration < +time) {
            duration = +time;
          }
        }
      }
    }
    return duration;
  }

  /**
   * The queued up events to be processed by the animation renderer.
   * @public
   */
  events: string[];

  /**
   * The number of iterations this Animation should play.
   * @public
   */
  iterations: number;

  /**
   * The keyframes that make up the animation.
   * @public
   */
  keyframes: Record<string, ja.TargetKeyframes>;

  /**
   * The labels present in the animation. This is a dictionary of named times
   * that can be used to configure or seek in the Animation.
   * @public
   */
  labels: Record<string, number>;

  /**
   * The event listeners in the animation.
   * @public
   */
  listeners: Record<string, ja.AnimationEventListener[]>;

  /**
   * The current playState.  This can be cancel, idle, running, or paused.
   * @publi
   */
  playState: ja.PlayState;

  /**
   * The current playbackRate.  1 is forwards, -1 is in reverse.  Use decimals
   * to perform slowmotion.
   * @public
   */
  playbackRate: number;

  constructor(options?: Partial<ja.TimelineConfig>) {
    const self = this;
    // Ensure new in case js user forgets new or chooses to rebel against new :)
    if (!(self instanceof Timeline)) {
      return new Timeline(options);
    }
    self.id = '_' + ++autoNumber;
    self.alternate = false;
    self.currentTime = 0;
    self.events = [];
    self.iterations = 1;
    self.keyframes = {};
    self.labels = {};
    self.listeners = {} as Record<
      ja.AnimationEvent,
      ja.AnimationEventListener[]
    >;
    self.playState = RUNNING;
    self.playbackRate = 1;

    if (options) {
      self.configure(options);
    }
    if (!self.id.indexOf('_')) {
      // If starts with _, it does not need to be registered globally.
    }
  }

  /**
   * Cancels the animation. The currentTime is set to 0 and the playState is set
   * to 'idle'.
   * @public
   */
  cancel(): this {
    this.playState = CANCEL;
    this.events.push(CANCEL);
    return queueTransition(this);
  }

  /**
   * Restores the state. This method can also be used to declaratively configure
   * the animation instead of using animate, set, etc.
   * @param json The state to restore.
   * @public
   */
  configure(json: Partial<ja.TimelineConfig>) {
    for (const k in json) {
      if (typeof this[k] !== 'function' && k !== 'duration') {
        this[k] = json[k];
      }
    }
    // Configure could result in rendering changes.
    return queueTransition(this);
  }

  /**
   * Finish the animation. If the playbackRate is negative (in reverse), finish
   * changes the currentTime to 0, otherwise it changes the currentTime to the
   * activeDuration.
   * @public
   */
  finish(): this {
    this.playState = FINISH;
    this.events.push(FINISH);
    return queueTransition(this);
  }

  /**
   * Gets the internal state of the Animation. This can be used to save and
   * restore the value of the timeline.
   * @public
   */
  getConfig(): ja.TimelineConfig {
    const memento = {} as ja.TimelineConfig;
    for (const key in this) {
      if (key[key.length - 1] !== '_') {
        const val = this[key];
        if (typeof val !== 'function') {
          memento[key as string] = val;
        }
      }
    }
    return memento;
  }

  /**
   * Get (and possibly) create the event group for listeners.
   * @param ev The event group to geja.
   * @private
   */
  private getEventGroup_(ev: ja.AnimationEvent) {
    let eventGroup = this.listeners[ev];
    if (!eventGroup) {
      eventGroup = this.listeners[ev] = [];
    }
    return eventGroup;
  }

  /**
   * Gets the position by resolving a label or just returning the number if it
   * was already a number
   * @param pos The position to insert the next animation object.
   * @protected
   */
  protected getPosition_(pos?: string | number): number {
    // Figure out where to insert this keyframe.
    if (pos && typeof pos !== 'number') {
      pos = this.labels[pos];
    }
    return pos as number;
  }

  /**
   * Creates a label for a specific time. Labels can be used to seek to specific
   * times in an animation and can be used to configure keyframes using the pos
   * parameter in animate() and set().
   * @param name
   * @param time
   * @public
   */
  label(name: string, time?: number): this {
    this.labels[name] = time === undefined ? this.duration : time;
    return this;
  }

  /**
   * Unregisters an event listener.
   * @param ev The event to unhandle.
   * @param f The function to unregister for handling the evenja.
   * @public
   */
  off(ev: ja.AnimationEvent, f: ja.AnimationEventListener): this {
    const callbacks = this.getEventGroup_(ev);
    const index = callbacks.indexOf(f);
    if (index !== -1) {
      callbacks.splice(index, 1);
    }
    return this;
  }

  /**
   * Registers an event listener to react on the specified evenja.
   * @param ev The event to handle.
   * @param f The function to handle the evenja.
   * @public
   */
  on(ev: ja.AnimationEvent, f: ja.AnimationEventListener): this {
    const callbacks = this.getEventGroup_(ev);
    const index = callbacks.indexOf(f);
    if (index === -1) {
      callbacks.push(f);
    }
    return this;
  }

  /**
   * Pauses the animation.
   * @public
   */
  pause(): this {
    this.playState = PAUSED;
    this.events.push('pause');
    return queueTransition(this);
  }

  /**
   * Plays the animation.
   * @public
   */
  play(): this {
    this.playState = RUNNING;
    this.events.push('play');
    return queueTransition(this);
  }

  /**
   * Seeks to the specified time or label. If a undefined label is provided,
   * the call to .seek() is ignored.
   * @param time
   * @public
   */
  seek(time: string | number): this {
    time = this.getPosition_(time);
    if (time || time === 0) {
      this.currentTime = time;
    }
    // If this is running, pause; otherwise ensure an update occurs.
    return this.playState !== RUNNING ? this.pause() : queueTransition(this);
  }

  /**
   * Forces an update. This can be used after updating timing or keyframes in
   * configure() to force an
   */
  update(): this {
    return queueTransition(this);
  }
}
