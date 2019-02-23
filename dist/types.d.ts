declare global {
  interface Window {
    just: {
      /**
       * A dictionary of ease names and functions to generate easing functions.
       */
      eases: Record<string, ja.EaseFactory>;
      /**
       * Parses the easeString and returns an ease function by calling the
       * appropriate ease from just.getEase().
       * @param easeString String to transform into an easing function.
       */
      getEase(easeString: string): ja.Ease;
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
      timeline(options?: Partial<ja.TimelineConfig>): ja.TimelineAnimation;
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

  export type AnimationEvent = 'cancel' | 'finish' | 'pause' | 'play';

  export interface AnimationEventListener {
    (time: number): void;
  }

  export interface AnimationOptions {
    labels: Record<string, number>;
  }

  export type AnimationTarget = {};

  export type AnimationValue = number | string;

  export interface Ease {
    (offset: number): number;
  }

  export interface EaseFactory {
    (...args: any[]): Ease;
  }

  export type EaseTypes = 'in' | 'out' | 'in-out';

  export interface Keyframe {
    $delay: number;
    $ease?: string;
    $endDelay: number;
    $stagger?: number;
    value: AnimationValue;
  }

  export type KeyframeProps = {
    /**
     * Adds a delay * n item resolved.  Using stagger resolves all targets
     */
    $stagger: number;
    /**
     * Adds a delay to the beginning of the keyframe.
     */
    $delay: number;
    /**
     * Applies an ease function (timing-function) to the keyframe.
     */
    $ease: string;
    /**
     * Position on the timeline to insert this animation.
     */
    $from: number | string;
    /**
     * Adds a delay to the end of the keyframe.
     */
    $endDelay: number;
    [propertyName: string]: any;
  };

  export type PlayState = 'cancel' | 'finish' | 'idle' | 'paused' | 'running';

  export interface TargetKeyframes {
    [prop: string]: {
      [time: string]: Keyframe;
    };
  }

  export interface TimelineAnimation extends TimelineConfig {
    /**
     * Configure a tween from the (current) position for the duration specified.
     * @param targets The element, object, or selector to animate.
     * @param duration The duration in milliseconds of the tween.
     * @param props The end state properties of the tween.
     * if not specified.
     * @public
     */
    animate<T>(
      targets: T | string,
      duration: number,
      props: Partial<KeyframeProps>
    ): this;

    /**
     * Cancels the animation. The currentTime is set to 0 and the playState is set
     * to 'idle'.
     * @public
     */
    cancel(): this;

    /**
     * Adds an empty animation in order to add a delay.
     * @param duration the amount of delay to add in milliseconds.
     * @public
     */
    delay(duration: number): this;

    /**
     * Finish the animation. If the playbackRate is negative (in reverse), finish
     * changes the currentTime to 0, otherwise it changes the currentTime to the
     * activeDuration.
     * @public
     */
    finish(): this;

    /**
     * Creates a label for a specific time. Labels can be used to seek to specific
     * times in an animation and can be used to configure keyframes
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
    set<T>(targets: T | string, props: Partial<KeyframeProps>): this;

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
     * Forces an update. This can be used after updating timing or keyframes in
     * configure() to force an
     * @public
     */
    update(): this;
  }

  export interface TimelineConfig {
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
     * A list of listeners for animation events.
     */
    listeners: Record<string, AnimationEventListener[]>;

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
  }
}
