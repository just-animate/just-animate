import { ja } from "./types";

export class TimelineAnimation {
  /**
   * True if the timeline should alternate.
   * @public
   */
  alternate = false;

  /**
   * The current time of the timeline. When using multiple iterations, this
   * represents the actual time, not the time of the iteration.
   * @public
   */
  currentTime = 0;

  /**
   * The duration of one iteration of the Animation.
   * @public
   */
  get duration() {
    let duration = 0;
    // Walk through all timelines and determine the longest duration.
    this.timelines_.forEach(timeline => {
      const endTime = timeline.animation.duration + timeline.pos;
      if (endTime > duration) {
        duration = endTime;
      }
    });

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
  events: string[] = [];

  /**
   * The number of iterations this Animation should play.
   * @public
   */
  iterations = 1;

  /**
   * The keyframes that make up the animation.
   * @public
   */
  keyframes: Record<string, ja.TargetKeyframes> = {};

  /**
   * The labels present in the animation. This is a dictionary of named times
   * that can be used to configure or seek in the Animation.
   * @public
   */
  labels: Record<string, number> = {};

  /**
   * The event listeners in the animation.
   * @private
   */
  private listeners_ = {} as Record<
    ja.AnimationEvent,
    ja.AnimationEventListener[]
  >;

  /**
   * The current playState.  This can be cancel, idle, running, or paused
   * @public
   */
  get playState(): ja.PlayState {
    return this.playState_;
  }
  set playState(v: ja.PlayState) {
    this.playState_ = v;
  }

  /**
   * The internal value of playState.
   * @private
   */
  private playState_ = "idle" as ja.PlayState;

  /**
   * The current playbackRate.  1 is forwards, -1 is in reverse.  Use decimals
   * to perform slowmotion.
   * @public
   */
  playbackRate = 1;

  /**
   * A counter for generating target ids.
   * @private
   */
  private targetIds_ = 0;

  /**
   * A dictionary of target aliases.
   * @private
   */
  targets = {} as Record<string, ja.AnimationTarget>;

  /**
   * The sub-timelines contained within this timeline.
   * @private
   */
  private timelines_: Array<{ pos: number; animation: ja.Animation }> = [];

  constructor(options?: Partial<ja.AnimationState>) {
    if (options) {
      this.setState(options);
    }
  }

  add(animation: ja.Animation, pos?: number | string): this {
    pos = this.getPosition_(pos);
    if (pos === undefined) {
      pos = this.duration;
    }
    this.timelines_.push({
      animation,
      pos
    });
    return this;
  }

  /**
   * Cancels the animation. The currentTime is set to 0 and the playState is set
   * to 'idle'.
   * @public
   */
  cancel(): this {
    this.playState = "idle";
    this.currentTime = 0;
    return this.trigger_("cancel");
  }

  /**
   * Adds an empty animation.
   * @param duration the amount to delay.
   * @public
   */
  delay(duration: number, pos?: string | number): this {
    return this.tween("", duration, { "": 0 }, pos);
  }

  /**
   * Finish the animation. If the playbackRate is negative (in reverse), finish
   * changes the currentTime to 0, otherwise it changes the currentTime to the
   * activeDuration.
   * @public
   */
  finish(): this {
    this.playState = "paused";
    this.currentTime = this.playbackRate < 0 ? 0 : this.getActiveDuration();
    return this.trigger_("finish");
  }

  /**
   * The total active duration of the animation. When iterations is set to
   * Infinity, this will return Infinity.
   * @public
   */
  getActiveDuration(): number {
    return this.duration * this.iterations;
  }

  /**
   * Get (and possibly) create the event group for listeners.
   * @param ev The event group to geja.
   * @private
   */
  private getEventGroup_(ev: ja.AnimationEvent) {
    let eventGroup = this.listeners_[ev];
    if (!eventGroup) {
      eventGroup = this.listeners_[ev] = [];
    }
    return eventGroup;
  }

  /**
   * Gets the position by resolving a label or just returning the number if it
   * was already a number
   * @param pos The position to insert the next animation objecja.
   * @private
   */
  private getPosition_(pos?: string | number): number {
    // Figure out where to insert this keyframe.
    if (pos && typeof pos !== "number") {
      pos = this.labels[pos];
    }
    return pos as number;
  }

  /**
   * Gets the internal state of the Animation. This can be used to save and
   * restore the value of the timeline.
   * @public
   */
  getState(): ja.AnimationState {
    const memento = {} as ja.AnimationState;
    for (const key in this) {
      if (key[key.length - 1] !== "_") {
        const val = this[key];
        if (key !== "duration" && typeof val !== "function") {
          memento[key as string] = val;
        }
      }
    }
    return memento;
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
    this.playState = "paused";
    return this.trigger_("pause");
  }

  /**
   * Plays the animation.
   * @public
   */
  play(): this {
    this.playState = "running";
    return this.trigger_("play");
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
    if (this.playState_ !== "running") {
      this.playState = "paused";
    }
    return this;
  }

  /**
   * Sets the properties at a given time. This is a convenience method for
   * calling animate with an ease of steps(1, end).
   * @public
   */
  set<T>(targets: T | string, props: ja.KeyframeProps, pos?: number | string) {
    props["ease" as string] = "steps(1,end)";
    return this.tween(targets, 0, props, pos);
  }

  /**
   * Restores the state. This method can also be used to declaratively configure
   * the animation instead of using animate, set, etc.
   * @param json The state to restore.
   * @public
   */
  setState(json: Partial<ja.AnimationState>) {
    for (const k in json) {
      if (json.hasOwnProperty(k)) {
        this[k] = json[k];
      }
    }
    return this;
  }

  /**
   * Creates a target alias that can be referred to in the targets parameter in
   * animate() and set().  It is recommended to prefix the alias with @ to
   * prevent conflicts with CSS selectors. This is useful for creating generic
   * animations where the target is not known when defining the tweens.
   * @param alias
   * @param target
   * @public
   */
  target(alias: string, target: ja.AnimationTarget): this {
    this.targets[alias] = target;
    return this;
  }

  /**
   * Triggers an evenja.
   * @param eventName The event to trigger.
   * @private
   */
  private trigger_(eventName: string): this {
    if (!this.events.length || this.events[this.events.length] !== eventName) {
      this.events.push(eventName);
    }
    return this;
  }

  /**
   * Configure a tween from the (current) position for the duration specified.
   * @param targets The element, object, or selector to animate.
   * @param duration The duration in milliseconds of the tween.
   * @param props The end state properties of the tween.
   * @param pos The position to insert the tween. This defaults to the duration
   * if not specified.
   * @public
   */
  tween<T>(
    targets: T | string,
    duration: number,
    props: Partial<ja.KeyframeProps>,
    pos?: number | string
  ): this {
    pos = this.getPosition_(pos);
    if (pos === undefined) {
      pos = this.duration;
    }

    /* If the target is not a string, create an alias so the keyframe can be
     * stored separatedly from the objects themselves. */
    if (typeof targets !== "string") {
      const targetId = "@auto_" + ++this.targetIds_;
      this.target(targetId, targets);
      targets = targetId;
    }

    let targetProps = this.keyframes[targets];
    if (!targetProps) {
      targetProps = this.keyframes[targets] = {};
    }

    // Figure out what ease and stagger to use.
    const ease = props.ease || "linear";
    const stagger = props.stagger || 0;

    // tslint:disable-next-line:forin
    for (const prop in props) {
      const value = props[prop];
      if (prop !== "ease" && (value || value === 0)) {
        let propKeyframes = targetProps[prop];
        if (!propKeyframes) {
          propKeyframes = targetProps[prop] = {};
        }

        propKeyframes[pos + duration] = {
          ease,
          stagger,
          value
        };
      }
    }

    return this;
  }
}
