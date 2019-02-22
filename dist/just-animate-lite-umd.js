(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.just = {}));
}(this, function (exports) { 'use strict';

  var tasks = [];
  var promise;
  var done;
  var taskId;
  function nextAnimationFrame() {
      if (!promise) {
          // If we haven't used a promise, this frame, create one.
          promise = new Promise(function (resolve) {
              done = resolve;
          });
      }
      if (!taskId) {
          // For consistency, simply asking for the nextAnimationFrame schedules
          // a tick if one isn't already scheduled.
          taskId = requestAnimationFrame(updateAll);
      }
      return promise;
  }
  function tick(task) {
      if (tasks.indexOf(task) === -1) {
          // If this task isn't already in the list, add it.
          tasks.push(task);
      }
      if (!taskId) {
          // If a tick isn't scheduled, schedule it.
          taskId = requestAnimationFrame(updateAll);
      }
  }
  function updateAll() {
      // Grab the current time so we can consistently provide a frame time to all
      // animations if they need a time.
      var tick = performance.now();
      for (var i = 0; i < tasks.length; i++) {
          // Call the update function. Functions that return truthy stay in queue.
          var stayInQueue = tasks[i](tick);
          if (!stayInQueue) {
              // Remove update functions that returned falsey values.
              tasks.splice(i, 1);
              i--;
          }
      }
      // If there are any tasks in queue, schedule next frame.
      taskId = tasks.length ? requestAnimationFrame(updateAll) : 0;
      if (done) {
          // If nextAnimationFrame() was called, resolve the promise to notify
          // all interested parties. We have to store the done call in a local
          // variable in case the code executed by then wants to reschedule another
          // event. In that case, we need a new promise, so we have to store it,
          // unassign it, and then resolve it.
          var done2 = done;
          done = 0;
          promise = 0;
          done2();
      }
  }

  /**
   * A helper for numeric sort. The default JavaScript sort is alphanumeric,
   * which would sort 1,9,10 to 1,10,9.
   * @param a the first term to compare.
   * @param b the second term to compare.
   */
  /**
   * Returns the min if the value is less than, the max if the value is greater
   * than, or the value if in between the min and max.
   * @param value The value to clamp.
   * @param min The minimum value to return.
   * @param max The maximum value to return.
   */
  function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
  }

  var IDLE = 'idle', PAUSED = 'paused', RUNNING = 'running', FINISH = 'finish', CANCEL = 'cancel';

  var FRAME_SIZE = 1000 / 60;
  var queue = [];
  var lastTime;
  var renderers = [];
  /**
   * Enqueues the timeline to be updated and rendered.
   * @param configurator
   */
  function queueTransition(configurator) {
      if (!queue.length) {
          lastTime = performance.now();
          tick(processTimelines);
      }
      if (queue.indexOf(configurator) === -1) {
          queue.push(configurator);
      }
      return configurator;
  }
  /**
   * Updates all the timelines.
   * @param time
   */
  function processTimelines(time) {
      // Determine the delta, clamp between 0ms and 34ms (0 frames and 2 frames).
      var delta = clamp(time - lastTime, 0, FRAME_SIZE * 2);
      lastTime = time;
      // Get a list of all configs, this should match by index, the queue.
      var configs = queue.slice();
      // Detect automatic playState changes
      for (var _i = 0, configs_1 = configs; _i < configs_1.length; _i++) {
          var config = configs_1[_i];
          detectPlayStateChanges(config);
      }
      // Update timing and fix inconsistencies.
      for (var _a = 0, configs_2 = configs; _a < configs_2.length; _a++) {
          var config = configs_2[_a];
          updateTiming(delta, config);
      }
      // Update the transient playStates.
      for (var _b = 0, configs_3 = configs; _b < configs_3.length; _b++) {
          var config = configs_3[_b];
          if (config.playState === CANCEL) {
              config.playState = IDLE;
          }
          else if (config.playState === FINISH) {
              config.playState = PAUSED;
          }
      }
      // Queue up all events.
      var listenersToCall = [];
      for (var _c = 0, configs_4 = configs; _c < configs_4.length; _c++) {
          var config = configs_4[_c];
          for (var _d = 0, _e = config.events; _d < _e.length; _d++) {
              var event = _e[_d];
              if (config.listeners) {
                  var listeners = config.listeners[event];
                  if (listeners && listeners.length) {
                      Array.prototype.push.apply(listenersToCall, listeners);
                  }
              }
          }
          // Remove configuration events.
          config.events.length = 0;
      }
      // Render changes to the targets.
      var operations = [];
      for (var _f = 0, configs_5 = configs; _f < configs_5.length; _f++) {
          var config = configs_5[_f];
          for (var _g = 0, renderers_1 = renderers; _g < renderers_1.length; _g++) {
              var renderer = renderers_1[_g];
              renderer(config, operations);
          }
      }
      // // Write configurations back to their configurators.
      // for (let i = 0; i < queue.length; i++) {
      //   queue[i].configure(configs[i]);
      // }
      // Remove items from the queue if they no longer need to be updated.
      for (var i = queue.length - 1; i > -1; i--) {
          if (configs[i].playState !== RUNNING) {
              queue.splice(i, 1);
          }
      }
      // Call all render operations.
      for (var _h = 0, operations_1 = operations; _h < operations_1.length; _h++) {
          var operation = operations_1[_h];
          operation();
      }
      // Call all listener callbacks.
      for (var _j = 0, listenersToCall_1 = listenersToCall; _j < listenersToCall_1.length; _j++) {
          var listener = listenersToCall_1[_j];
          listener(time);
      }
      // Continue on the next loop if any configurators remain.
      return !!queue.length;
  }
  function detectPlayStateChanges(config) {
      if (config.playState === RUNNING) {
          var isBackwards = config.playbackRate < 0;
          var activeDuration = config.duration * config.iterations;
          // If it is off by one, clamp it.
          var isFinished = (isBackwards && config.currentTime <= 1) ||
              (!isBackwards && config.currentTime >= activeDuration - 1);
          if (isFinished) {
              config.playState = FINISH;
              config.events.push(FINISH);
          }
      }
  }
  /**
   * Updates the configuration with the amount of time that has elapsed since the
   * last update.
   * @param delta The amount of milliseconds since the last update.
   * @param config The configuration to update.
   */
  function updateTiming(delta, config) {
      // Make sure iterations is at least 1 and below Infinity.
      var SECONDS_IN_A_DAY = 86400;
      config.iterations = clamp(config.iterations, 1, SECONDS_IN_A_DAY * 7);
      // Figure out the active duration.
      var activeDuration = config.duration * config.iterations;
      if (config.playState === CANCEL) {
          // Reset the timeline.
          config.currentTime = 0;
          config.playbackRate = 1;
      }
      else if (config.playState === FINISH) {
          // Finish at 0 or the duration based on the playbackRate.
          config.currentTime = config.playbackRate < 0 ? 0 : activeDuration;
      }
      else {
          if (config.playState === RUNNING) {
              // Find the current time and clamp it between 0 and the active duration.
              config.currentTime += delta * config.playbackRate;
          }
      }
      // Ensure current time is not out of bounds.
      config.currentTime = clamp(config.currentTime, 0, activeDuration);
  }

  var autoNumber = 0;
  var Timeline = /** @class */ (function () {
      function Timeline(options) {
          var self = this;
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
          self.listeners = {};
          self.playState = RUNNING;
          self.playbackRate = 1;
          self.timelines_ = [];
          if (options) {
              self.configure(options);
          }
          if (!self.id.indexOf('_')) ;
      }
      Object.defineProperty(Timeline.prototype, "duration", {
          /**
           * The duration of one iteration of the Animation.
           * @public
           */
          get: function () {
              var duration = 0;
              // Walk through all timelines and determine the longest duration.
              this.timelines_.forEach(function (timeline) {
                  duration = Math.max(duration, timeline.animation.duration + timeline.pos);
              });
              // Walk through all keyframes and determine the longest duration.
              // tslint:disable-next-line:forin
              for (var targetName in this.keyframes) {
                  var target = this.keyframes[targetName];
                  // tslint:disable-next-line:forin
                  for (var propName in target) {
                      for (var time in target[propName]) {
                          if (duration < +time) {
                              duration = +time;
                          }
                      }
                  }
              }
              return duration;
          },
          enumerable: true,
          configurable: true
      });
      // tslint:disable-next-line:no-any
      Timeline.prototype.add = function (animation, options) {
          options = options || {};
          var pos = this.getPosition_(options.$from);
          if (pos == null) {
              pos = this.duration;
          }
          this.timelines_.push({
              animation: animation,
              pos: pos,
          });
          return queueTransition(this);
      };
      /**
       * Cancels the animation. The currentTime is set to 0 and the playState is set
       * to 'idle'.
       * @public
       */
      Timeline.prototype.cancel = function () {
          this.playState = CANCEL;
          this.events.push(CANCEL);
          return queueTransition(this);
      };
      /**
       * Restores the state. This method can also be used to declaratively configure
       * the animation instead of using animate, set, etc.
       * @param json The state to restore.
       * @public
       */
      Timeline.prototype.configure = function (json) {
          for (var k in json) {
              if (typeof this[k] !== 'function' && k !== 'duration') {
                  this[k] = json[k];
              }
          }
          // Configure could result in rendering changes.
          return queueTransition(this);
      };
      /**
       * Finish the animation. If the playbackRate is negative (in reverse), finish
       * changes the currentTime to 0, otherwise it changes the currentTime to the
       * activeDuration.
       * @public
       */
      Timeline.prototype.finish = function () {
          this.playState = FINISH;
          this.events.push(FINISH);
          return queueTransition(this);
      };
      /**
       * Gets the internal state of the Animation. This can be used to save and
       * restore the value of the timeline.
       * @public
       */
      Timeline.prototype.getConfig = function () {
          var memento = {};
          for (var key in this) {
              if (key[key.length - 1] !== '_') {
                  var val = this[key];
                  if (typeof val !== 'function') {
                      memento[key] = val;
                  }
              }
          }
          return memento;
      };
      /**
       * Get (and possibly) create the event group for listeners.
       * @param ev The event group to geja.
       * @private
       */
      Timeline.prototype.getEventGroup_ = function (ev) {
          var eventGroup = this.listeners[ev];
          if (!eventGroup) {
              eventGroup = this.listeners[ev] = [];
          }
          return eventGroup;
      };
      /**
       * Gets the position by resolving a label or just returning the number if it
       * was already a number
       * @param pos The position to insert the next animation object.
       * @protected
       */
      Timeline.prototype.getPosition_ = function (pos) {
          // Figure out where to insert this keyframe.
          if (pos && typeof pos !== 'number') {
              pos = this.labels[pos];
          }
          return pos;
      };
      /**
       * Creates a label for a specific time. Labels can be used to seek to specific
       * times in an animation and can be used to configure keyframes using the pos
       * parameter in animate() and set().
       * @param name
       * @param time
       * @public
       */
      Timeline.prototype.label = function (name, time) {
          this.labels[name] = time === undefined ? this.duration : time;
          return this;
      };
      /**
       * Unregisters an event listener.
       * @param ev The event to unhandle.
       * @param f The function to unregister for handling the evenja.
       * @public
       */
      Timeline.prototype.off = function (ev, f) {
          var callbacks = this.getEventGroup_(ev);
          var index = callbacks.indexOf(f);
          if (index !== -1) {
              callbacks.splice(index, 1);
          }
          return this;
      };
      /**
       * Registers an event listener to react on the specified evenja.
       * @param ev The event to handle.
       * @param f The function to handle the evenja.
       * @public
       */
      Timeline.prototype.on = function (ev, f) {
          var callbacks = this.getEventGroup_(ev);
          var index = callbacks.indexOf(f);
          if (index === -1) {
              callbacks.push(f);
          }
          return this;
      };
      /**
       * Pauses the animation.
       * @public
       */
      Timeline.prototype.pause = function () {
          this.playState = PAUSED;
          this.events.push('pause');
          return queueTransition(this);
      };
      /**
       * Plays the animation.
       * @public
       */
      Timeline.prototype.play = function () {
          this.playState = RUNNING;
          this.events.push('play');
          return queueTransition(this);
      };
      /**
       * Seeks to the specified time or label. If a undefined label is provided,
       * the call to .seek() is ignored.
       * @param time
       * @public
       */
      Timeline.prototype.seek = function (time) {
          time = this.getPosition_(time);
          if (time || time === 0) {
              this.currentTime = time;
          }
          // If this is running, pause; otherwise ensure an update occurs.
          return this.playState !== RUNNING ? this.pause() : queueTransition(this);
      };
      /**
       * Forces an update. This can be used after updating timing or keyframes in
       * configure() to force an
       */
      Timeline.prototype.update = function () {
          return queueTransition(this);
      };
      return Timeline;
  }());

  function renderSubtimeline(config, operations) { }

  // Register timeline renderers.
  renderers.push(renderSubtimeline);

  exports.nextAnimationFrame = nextAnimationFrame;
  exports.Timeline = Timeline;
  exports.tick = tick;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
