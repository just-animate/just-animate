declare global {
  interface Window {
    just: {
      /**
       * Returns a promise that resolves after all work is complete on the next
       * animation frame. This is intended mostly for integration testing.
       */
      nextAnimationFrame(): Promise<void>;
      /**
       * Executes the function on tick. Return true to continue running the
       * function each cycle or return false to dequeue the function.
       * @param fn the function to be executed.
       */
      tick(fn: () => boolean): void;
      /**
       * Creates a new TimelineAnimation.
       * @param options The initial state of the timeline
       * @returns {!TimelineAnimation}
       * @public
       */
      timeline(options?: Partial<ja.AnimationState>): ja.TimelineAnimation;
    };
  }
}

export namespace ja {
  export interface Animation {
    currentTime: number;
    duration: number;
    playState: PlayState;
    playbackRate: number;

    cancel(): void | this;
    finish(): void | this;
    pause(): void | this;
    play(): void | this;
  }

  export type AnimationEvent = "cancel" | "finish" | "pause" | "play";

  export interface AnimationEventListener {
    (time: number): void;
  }

  export interface AnimationOptions {
    labels: Record<string, number>;
  }

  export interface AnimationState {
    alternate: boolean;
    currentTime: number;
    events: string[];
    iterations: number;
    keyframes: Record<string, TargetKeyframes>;
    labels: Record<string, number>;
    playState: PlayState;
    playbackRate: number;
    targets: Record<string, AnimationTarget>;
  }

  export type AnimationTarget = {};

  export type AnimationValue = boolean | number | string | Date;

  export interface Ease {
    (offset: number): number;
  }

  export interface EaseFactory {
    (...args: Array<string | number>): Ease;
  }

  export interface Keyframe {
    ease?: string;
    stagger?: number;
    value: AnimationValue;
  }

  export type KeyframeProps = {
    ease: string;
    stagger: number;
    [propertyName: string]: AnimationValue;
  };

  export interface Interpolator<T> {
    (offset: number): T;
  }

  export interface Renderer {
    handle(target: {}, key: string): boolean;
    read<T>(target: {}, key: string): T;
    render<T>(target: {}, key: string, value: T): void;
    mix<T>(left: T, right: T): Interpolator<T>;
  }

  export type PlayState = "cancel" | "idle" | "paused" | "running";

  export interface TargetKeyframes {
    [prop: string]: {
      [time: string]: Keyframe;
    };
  }

  export interface TimelineAnimation extends Animation {
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
    duration: number;

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
    keyframes: Record<string, TargetKeyframes>;

    /**
     * The labels present in the animation. This is a dictionary of named times
     * that can be used to configure or seek in the Animation.
     * @public
     */
    labels: Record<string, number>;

    /**
     * The current playState.  This can be cancel, idle, running, or paused
     * @public
     */
    playState: PlayState;

    /**
     * The current playbackRate.  1 is forwards, -1 is in reverse.  Use decimals
     * to perform slowmotion.
     * @public
     */
    playbackRate: number;

    /**
     * A dictionary of target aliases.
     * @public
     */
    targets: Record<string, AnimationTarget>;

    /** TODO */
    add(animation: Animation, pos: number | string): this;

    /**
     * Cancels the animation. The currentTime is set to 0 and the playState is set
     * to 'idle'.
     * @public
     */
    cancel(): this;

    /**
     * Adds an empty animation in order to add a delay.
     * @param duration the amount of delay to add in milliseconds.
     * @param pos the position to insert the empty animation.
     */
    delay(duration: number, pos?: string | number): this;

    /**
     * Finish the animation. If the playbackRate is negative (in reverse), finish
     * changes the currentTime to 0, otherwise it changes the currentTime to the
     * activeDuration.
     * @public
     */
    finish(): this;

    /**
     * The total active duration of the animation. When iterations is set to
     * Infinity, this will return Infinity.
     * @public
     * @returns {number}
     */
    getActiveDuration(): number;

    /**
     * Gets the internal state of the Animation. This can be used to save and
     * restore the value of the timeline.
     * @public
     */
    getState(): AnimationState;

    /**
     * Creates a label for a specific time. Labels can be used to seek to specific
     * times in an animation and can be used to configure keyframes using the pos
     * parameter in animate() and set().
     * @param name
     * @param time
     * @public
     */
    label(name: string, time: number): this;

    /**
     * Unregisters an event listener.
     * @param ev The event to unhandle.
     * @param f The function to unregister for handling the even
     * @public
     */
    off(ev: AnimationEvent, f: AnimationEventListener): this;

    /**
     * Registers an event listener to react on the specified even
     * @param ev The event to handle.
     * @param f The function to handle the even
     * @public
     */
    on(ev: AnimationEvent, f: AnimationEventListener): this;

    /**
     * Pauses the animation.
     * @public
     */
    pause(): this;

    /**
     * Plays the animation.
     * @public
     */
    play(): this;

    /**
     * Seeks to the specified time or label. If a undefined label is provided,
     * the call to .seek() is ignored.
     * @param time
     * @public
     */
    seek(time: string | number): this;

    /**
     * Sets the properties at a given time. This is a convenience method for
     * calling animate with an ease of steps(1, end).
     * @public
     */
    set<T>(
      targets: T | string,
      props: Partial<KeyframeProps>,
      pos: number | string
    ): this;

    /**
     * Restores the state. This method can also be used to declaratively configure
     * the animation instead of using animate, set, etc.
     * @param json The state to restore.
     * @public
     */
    setState(json: Partial<AnimationState>): {};

    /**
     * Creates a target alias that can be referred to in the targets parameter in
     * animate() and set().  It is recommended to prefix the alias with @ to
     * prevent conflicts with CSS selectors. This is useful for creating generic
     * animations where the target is not known when defining the tweens.
     * @param alias
     * @param target
     * @public
     */
    target(alias: string, target: AnimationTarget): this;

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
      props: Partial<KeyframeProps>,
      pos: number | string
    ): this;
  }
}
