(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.just = {}));
}(this, function (exports) { 'use strict';

  /**
   * A helper for numeric sort. The default JavaScript sort is alphanumeric,
   * which would sort 1,9,10 to 1,10,9.
   * @param a the first term to compare.
   * @param b the second term to compare.
   */
  function byNumber(a, b) {
      return a - b;
  }
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
  /**
   * Finds the index before the provided value.
   * @param list The list to search.
   * @param value The value to reference.
   */
  function findLowerIndex(list, value) {
      var i = 0;
      while (i < list.length) {
          if (list[i] > value) {
              --i;
              break;
          }
          i++;
      }
      return Math.min(i, list.length - 1);
  }
  /**
   * Returns true if the string or nunmber is numeric.
   * @param obj to test for numbers
   */
  function isNumeric(obj) {
      return typeof obj === "number" || isFinite(+obj);
  }
  /**
   * Coerces a number string into a number;
   * @param str the string to coerce.
   */
  function toNumber(str) {
      return +str;
  }
  //# sourceMappingURL=numbers.js.map

  var htmlAttributeOnly = ["viewBox"];
  var htmlPropOnly = ["innerHTML", "textContent"];
  var TRANSFORM_REGEX = 
  // Match on all transform functions.
  /(perspective|matrix(3d)?|skew[xy]?|(translate|scale|rotate)([xyz]|3d)?)\(/i;
  var UNIT_REGEX = /^(\-?[0-9.]+)([a-z%]*)$/i;
  var attributeReaderWriter = {
      read: function (target, key) {
          return target.getAttribute(key) || "";
      },
      write: function (target, key, value) {
          target.setAttribute(key, value.toString());
      }
  };
  var cssVarReaderWriter = {
      read: function (target, key) {
          return target.style.getPropertyValue(key);
      },
      write: function (target, key, value) {
          target.style.setProperty(key, value.toString());
      }
  };
  var propertyReaderWriter = {
      read: function (target, key) {
          return target[key];
      },
      write: function (target, key, value) {
          target[key] = value;
      }
  };
  var styleReaderWriter = {
      read: function (target, key) {
          return getComputedStyle(target)[key];
      },
      write: function (target, key, value) {
          target.style[key] = value;
      }
  };
  function getAnimator(target, propertyName) {
      var readerWriter = getReaderWriter(target, propertyName);
      return {
          mix: autoMixer,
          read: readerWriter.read,
          write: readerWriter.write
      };
  }
  // tslint:disable-next-line:no-any
  var matrix;
  function toMatrix(value) {
      if (!matrix) {
          // tslint:disable-next-line:no-any
          var w = window;
          matrix = w.WebKitCSSMatrix || w.MSCSSMatrix || w.DOMMatrix;
      }
      // TODO: ensure 3d is used with 3d at some point.
      return new matrix(value || "").toString();
  }
  /**
   * This mixer attempts to automatically parse CSS expressions from each value
   * and then create an interpolated value from it.
   * @param valueA The left value to mix.
   * @param valueB The right value to mix.
   * @param offset The progression offset to use.
   */
  function autoMixer(valueA, valueB, offset) {
      return detectMixer(valueA, valueB)(valueA, valueB, offset);
  }
  /**
   * This mixer attempts to automatically parse CSS expressions from each value
   * and then create an interpolated value from it.
   * @param valueA The left value to mix.
   * @param valueB The right value to mix.
   * @param offset The progression offset to use.
   */
  function detectMixer(valueA, valueB) {
      var isNumericA = isNumeric(valueA);
      var isNumericB = isNumeric(valueB);
      if (isNumericA && isNumericB) {
          return numberMixer;
      }
      if (isPath(valueA) || isPath(valueB)) {
          return pathMixer;
      }
      if (isUnit(valueA) || isUnit(valueB)) {
          return unitMixer;
      }
      return fallbackMixer;
  }
  function numberMixer(a, b, o) {
      return (+a + +b) * o;
  }
  function isUnit(value) {
      return !!UNIT_REGEX.test(value.toString());
  }
  function isPath(value) {
      return /^([mhvlcsqt][0-9, \-.]+)+z?$/i.test(value + "");
  }
  function pathMixer(a, b, o) {
      var pathA = getAllTerms(a + "", /([mhvlcsqtz]|[0-9\-.]+)/gi);
      var pathB = getAllTerms(b + "", /([mhvlcsqtz]|[0-9\-.]+)/gi);
      if (pathA.length !== pathB.length) {
          throw new Error("Paths do not have the same number of terms");
      }
      var result = "";
      for (var i = 0; i < pathA.length; i++) {
          if (!!i) {
              result += " ";
          }
          result += autoMixer(pathA[i], pathB[i], o);
      }
      return result;
  }
  function unitMixer(a, b, o) {
      var unitA = UNIT_REGEX.exec(a + "");
      var unitB = UNIT_REGEX.exec(b + "");
      // Prefer the unit on the left.  This allows 0 and 10px to mix properly.
      return numberMixer(unitA[1], unitB[1], o) + (unitA[2] || unitB[2] || "");
  }
  /**
   * This mixer attempts to automatically parse CSS expressions from each value
   * and then create an interpolated value from it.
   * @param valueA The left value to mix.
   * @param valueB The right value to mix.
   * @param offset The progression offset to use.
   */
  function fallbackMixer(valueA, valueB, offset) {
      // If either looks like a transform function, convert them.
      if (TRANSFORM_REGEX.test(valueA.toString()) ||
          TRANSFORM_REGEX.test(valueB.toString())) {
          valueA = toMatrix(valueA);
          valueB = toMatrix(valueB);
      }
      // Parse both into expression lists.
      var expressionA = parseCssExpression(valueA);
      var expressionB = parseCssExpression(valueB);
      if (expressionA.length !== expressionB.length) {
          // If the two sets are not equal, the best thing we can do is interpolate.
          return offset < 0.5 ? valueB : valueA;
      }
      // Walk through the terms and decide whether it is a numeric mixer or a
      // discrete mixer.  Append these results together.
      var result = [];
      var remainingColorChannels = 0;
      var listLength = expressionA.length;
      for (var i = 0; i < listLength; i++) {
          var termA = expressionA[i];
          var termB = expressionB[i];
          // True if there is at least one term after this.
          var hasNextTerm = i < listLength - 1;
          // Test if this expression is part of an RGB css function.
          var isRgbFunction = (termA === "rgb" || termA === "rgba") &&
              hasNextTerm &&
              expressionA[i + 1] === "(";
          if (isRgbFunction) {
              // Wait for 3 color channels.
              remainingColorChannels = 3;
          }
          // If the next expression is a px value on a or b, we should lock to whole
          // numbers, otherwise lock to 4.
          var precision = hasNextTerm &&
              (expressionA[i + 1] === "px" || expressionB[i + 1] === "px")
              ? 1
              : 1000;
          if (typeof termA === "number" && typeof termB === "number") {
              if (remainingColorChannels) {
                  // Mixing RGB channels properly requires squaring the terms, performing
                  // interpolation, and then unsquaring it.
                  result.push(Math.round(Math.sqrt(clamp((termA * termA + termB * termB) * offset, 0, 255 * 255))));
                  remainingColorChannels--;
              }
              else {
                  // Otherwise perform normal numeric interplation.
                  result.push(Math.round((termA + termB) * offset * precision) / precision);
              }
          }
          else if (isUnit(termA) || isUnit(termB)) {
              result.push(unitMixer(termA, termB, offset));
          }
          else {
              result.push(offset < 0.5 ? termB : termA);
          }
      }
      return termsToString(result);
  }
  function getReaderWriter(target, propertyName) {
      if (target instanceof Element) {
          if (propertyName.indexOf("--") === 0) {
              return cssVarReaderWriter;
          }
          if (htmlAttributeOnly.indexOf(propertyName) !== -1) {
              return attributeReaderWriter;
          }
          if (htmlPropOnly.indexOf(propertyName) !== -1) {
              return propertyReaderWriter;
          }
          return styleReaderWriter;
      }
      return propertyReaderWriter;
  }
  function getAllTerms(input, regex) {
      var terms = [];
      var result;
      // tslint:disable-next-line:no-conditional-assignment
      while ((result = regex.exec(input))) {
          terms.push(result[1]);
      }
      return terms;
  }
  /**
   * Parse a string into a list of terms.
   * @param value the value to parse
   */
  function parseCssExpression(input) {
      input = input
          .toString()
          .replace(/#[a-f0-9]{3}([a-f0-9]{3})?/gi, hexToRgb)
          .trim();
      // tslint:disable-next-line:max-line-length
      var TERM_REGEX = /([a-z]{2,}[a-z0-9]+|[0-9\.\-]+[a-z%]*|[mhvlcsqtz\/,\(\)])/gi;
      // ([a-z][a-z0-9_-]*|#?\-?\d*\.?\d*[a-z%]*) <- everything but paths.
      return getAllTerms(input, TERM_REGEX).reduce(function (c, n) {
          var value = maybeParseNumber(n);
          if (value !== "") {
              c.push(value);
          }
          return c;
      }, []);
  }
  /**
   * Attempts to parse the a number from the string, otherwise just returns the
   * original string.
   * @param value The value to attempt to parse.
   */
  function maybeParseNumber(value) {
      value = value.trim();
      return !value ? "" : isFinite(+value) ? +value : value;
  }
  function hexToRgb(stringValue) {
      var hex = stringValue.substring(1);
      var hexColor = parseInt(hex.length === 3
          ? hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
          : hex, 16);
      var r = (hexColor >> 16) & 0xff;
      var g = (hexColor >> 8) & 0xff;
      var b = hexColor & 0xff;
      return "rgb(" + r + "," + g + "," + b + ")";
  }
  function termsToString(aTerms) {
      var NUM = 1;
      var PUNCT = 2;
      var WORD = 3;
      var result = "";
      var lastType = 0;
      for (var i = 0, len = aTerms.length; i < len; i++) {
          var term = aTerms[i];
          var type = typeof term === "number" ? NUM : /^[\(\)\/,]$/i.test(term) ? PUNCT : WORD;
          if (i !== 0 && type === NUM && lastType !== PUNCT) {
              result += " ";
          }
          result += term;
          if (term === ")" && aTerms[i + 1] !== ")" && i !== len - 1) {
              result += " ";
          }
          lastType = type;
      }
      return result;
  }
  //# sourceMappingURL=render.js.map

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
  //# sourceMappingURL=loop.js.map

  var FRAME_SIZE = 1000 / 60;
  var queue = [];
  var lastTime;
  /**
   * Enqueues the timeline to be updated and rendered.
   * @param configurator
   */
  function animate(configurator) {
      if (!queue.length) {
          lastTime = performance.now();
          tick(processTimelines);
      }
      if (queue.indexOf(configurator) === -1) {
          queue.push(configurator);
      }
  }
  /**
   * Gets all of the times in the property in order.
   * @param property The property from which to extract times.
   */
  function getTimes(property) {
      return Object.keys(property)
          .map(toNumber)
          .sort(byNumber);
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
      var configs = queue.map(function (configurator) { return configurator.getConfig(); });
      // Update timing and fix inconsistencies.
      for (var _i = 0, configs_1 = configs; _i < configs_1.length; _i++) {
          var config = configs_1[_i];
          updateTiming(delta, config);
      }
      // Update the playStates.
      for (var _a = 0, configs_2 = configs; _a < configs_2.length; _a++) {
          var config = configs_2[_a];
          updatePlayState(config);
      }
      // Queue up all events.
      var listenersToCall = [];
      for (var _b = 0, configs_3 = configs; _b < configs_3.length; _b++) {
          var config = configs_3[_b];
          for (var _c = 0, _d = config.events; _c < _d.length; _c++) {
              var event = _d[_c];
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
      for (var _e = 0, configs_4 = configs; _e < configs_4.length; _e++) {
          var config = configs_4[_e];
          renderState(config, operations);
      }
      // Write configurations back to their configurators.
      for (var i = 0; i < queue.length; i++) {
          queue[i].configure(configs[i]);
      }
      // Remove items from the queue if they no longer need to be updated.
      for (var i = queue.length - 1; i > -1; i--) {
          if (configs[i].playState !== "running") {
              queue.splice(i, 1);
          }
      }
      // Call all render operations.
      for (var _f = 0, operations_1 = operations; _f < operations_1.length; _f++) {
          var operation = operations_1[_f];
          operation();
      }
      // Call all listener callbacks.
      for (var _g = 0, listenersToCall_1 = listenersToCall; _g < listenersToCall_1.length; _g++) {
          var listener = listenersToCall_1[_g];
          listener(time);
      }
      // Continue on the next loop if any configurators remain.
      return !!queue.length;
  }
  /**
   * Renders the current state of the dopesheet.
   * @param config The configuration to read.
   */
  function renderState(config, operations) {
      var currentTime = config.currentTime;
      for (var targetName in config.keyframes) {
          var keyframes = config.keyframes[targetName];
          var targets = resolveTargets(config, targetName);
          var _loop_1 = function (propName) {
              var property = keyframes[propName];
              var times = getTimes(property);
              var _loop_2 = function (target) {
                  var animator = getAnimator(target, propName);
                  var lowerIndex = findLowerIndex(times, currentTime);
                  var lowerTime = lowerIndex === -1 ? 0 : times[lowerIndex];
                  var lowerFrame = property[times[lowerIndex]];
                  // Get the final value. This can be done for all targets.
                  var upperIndex = Math.min(lowerIndex + 1, times.length - 1);
                  var upperTime = times[upperIndex];
                  var upperFrame = property[upperTime];
                  // Get the current value and calculate the next value, only attempt to
                  // render if they are different. It is assumed that the cost of reading
                  // constantly is less than the cost of writing constantly.
                  var offset = (upperTime - currentTime) / (upperTime - lowerTime);
                  var currentValue = animator.read(target, propName);
                  var value = animator.mix(lowerFrame.value, upperFrame.value, offset);
                  if (currentValue !== value) {
                      // Queue up the rendering of the value.
                      operations.push(function () { return animator.write(target, propName, value); });
                  }
              };
              for (var _i = 0, targets_1 = targets; _i < targets_1.length; _i++) {
                  var target = targets_1[_i];
                  _loop_2(target);
              }
          };
          for (var propName in keyframes) {
              _loop_1(propName);
          }
      }
  }
  /**
   * Resolves a selector or an at-target.
   * @param config The timeline configuration.
   * @param target The target to resolve.
   */
  function resolveTargets(config, target) {
      if (!target) {
          return [];
      }
      if (target.indexOf("@") !== 0) {
          // TODO:(add component scoping here)
          // If it isn't a reference, use it as a selector and make that into an [].
          return Array.prototype.slice.call(document.querySelectorAll(target));
      }
      // Get the target if it exists
      var maybeTarget = config.targets[target];
      if (!maybeTarget) {
          throw Error("Target " + target + " not configured.");
      }
      // If the target is an array, just return it.
      if (typeof maybeTarget.length === "number") {
          return maybeTarget;
      }
      // If the target is not an array, wrap it.
      return [maybeTarget];
  }
  function updatePlayState(config) {
      if (config.playState === "cancel") {
          config.playState = "idle";
      }
      else if (config.playState === "finish") {
          config.playState = "idle";
      }
      else {
          var activeDuration = config.duration * config.iterations;
          if (config.playbackRate < 0) {
              if (config.currentTime === 0) {
                  config.playState = "idle";
                  config.events.push("finish");
              }
          }
          else {
              if (config.currentTime === activeDuration) {
                  config.playState = "idle";
                  config.events.push("finish");
              }
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
      if (config.playState === "cancel") {
          // Reset the timeline.
          config.currentTime = 0;
          config.playbackRate = 1;
      }
      else if (config.playState === "finish") {
          // Finish at 0 or the duration based on the playbackRate.
          config.currentTime = config.playbackRate < 0 ? 0 : activeDuration;
      }
      else {
          if (config.playState === "running") {
              // Find the current time and clamp it between 0 and the active duration.
              config.currentTime += delta * config.playbackRate;
          }
      }
      // Ensure current time is not out of bounds.
      config.currentTime = clamp(config.currentTime, 0, activeDuration);
  }
  //# sourceMappingURL=animator.js.map

  var TimelineAnimation = /** @class */ (function () {
      function TimelineAnimation(options) {
          /**
           * True if the timeline should alternate.
           * @public
           */
          this.alternate = false;
          /**
           * The current time of the timeline. When using multiple iterations, this
           * represents the actual time, not the time of the iteration.
           * @public
           */
          this.currentTime = 0;
          /**
           * The queued up events to be processed by the animation renderer.
           * @public
           */
          this.events = [];
          /**
           * The number of iterations this Animation should play.
           * @public
           */
          this.iterations = 1;
          /**
           * The keyframes that make up the animation.
           * @public
           */
          this.keyframes = {};
          /**
           * The labels present in the animation. This is a dictionary of named times
           * that can be used to configure or seek in the Animation.
           * @public
           */
          this.labels = {};
          /**
           * The event listeners in the animation.
           * @public
           */
          this.listeners = {};
          /**
           * The current playState.  This can be cancel, idle, running, or paused.
           * @publi
           */
          this.playState = "idle";
          /**
           * The current playbackRate.  1 is forwards, -1 is in reverse.  Use decimals
           * to perform slowmotion.
           * @public
           */
          this.playbackRate = 1;
          /**
           * A counter for generating target ids.
           * @private
           */
          this.targetIds_ = 0;
          /**
           * A dictionary of target aliases.
           * @private
           */
          this.targets = {};
          /**
           * The sub-timelines contained within this timeline.
           * @private
           */
          this.timelines_ = [];
          if (options) {
              this.configure(options);
          }
      }
      Object.defineProperty(TimelineAnimation.prototype, "duration", {
          /**
           * The duration of one iteration of the Animation.
           * @public
           */
          get: function () {
              var duration = 0;
              // Walk through all timelines and determine the longest duration.
              this.timelines_.forEach(function (timeline) {
                  var endTime = timeline.animation.duration + timeline.pos;
                  if (endTime > duration) {
                      duration = endTime;
                  }
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
      TimelineAnimation.prototype.add = function (animation, pos) {
          pos = this.getPosition_(pos);
          if (pos === undefined) {
              pos = this.duration;
          }
          this.timelines_.push({
              animation: animation,
              pos: pos
          });
          return this;
      };
      /**
       * Cancels the animation. The currentTime is set to 0 and the playState is set
       * to 'idle'.
       * @public
       */
      TimelineAnimation.prototype.cancel = function () {
          this.playState = "cancel";
          this.events.push("cancel");
          animate(this);
          return this;
      };
      /**
       * Restores the state. This method can also be used to declaratively configure
       * the animation instead of using animate, set, etc.
       * @param json The state to restore.
       * @public
       */
      TimelineAnimation.prototype.configure = function (json) {
          var currentTime = this.currentTime;
          var duration = this.duration;
          for (var k in json) {
              if (typeof this[k] !== "function" && k !== "duration") {
                  this[k] = json[k];
              }
          }
          return this;
      };
      /**
       * Adds an empty animation.
       * @param duration the amount to delay.
       * @public
       */
      TimelineAnimation.prototype.delay = function (duration, pos) {
          return this.animate("", duration, { "": 0 }, pos);
      };
      /**
       * Finish the animation. If the playbackRate is negative (in reverse), finish
       * changes the currentTime to 0, otherwise it changes the currentTime to the
       * activeDuration.
       * @public
       */
      TimelineAnimation.prototype.finish = function () {
          this.playState = "finish";
          this.events.push("finish");
          animate(this);
          return this;
      };
      /**
       * Gets the internal state of the Animation. This can be used to save and
       * restore the value of the timeline.
       * @public
       */
      TimelineAnimation.prototype.getConfig = function () {
          var memento = {};
          for (var key in this) {
              if (key[key.length - 1] !== "_") {
                  var val = this[key];
                  if (typeof val !== "function") {
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
      TimelineAnimation.prototype.getEventGroup_ = function (ev) {
          var eventGroup = this.listeners[ev];
          if (!eventGroup) {
              eventGroup = this.listeners[ev] = [];
          }
          return eventGroup;
      };
      /**
       * Gets the position by resolving a label or just returning the number if it
       * was already a number
       * @param pos The position to insert the next animation objecja.
       * @private
       */
      TimelineAnimation.prototype.getPosition_ = function (pos) {
          // Figure out where to insert this keyframe.
          if (pos && typeof pos !== "number") {
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
      TimelineAnimation.prototype.label = function (name, time) {
          this.labels[name] = time === undefined ? this.duration : time;
          return this;
      };
      /**
       * Unregisters an event listener.
       * @param ev The event to unhandle.
       * @param f The function to unregister for handling the evenja.
       * @public
       */
      TimelineAnimation.prototype.off = function (ev, f) {
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
      TimelineAnimation.prototype.on = function (ev, f) {
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
      TimelineAnimation.prototype.pause = function () {
          this.playState = "paused";
          this.events.push("pause");
          animate(this);
          return this;
      };
      /**
       * Plays the animation.
       * @public
       */
      TimelineAnimation.prototype.play = function () {
          this.playState = "running";
          this.events.push("play");
          animate(this);
          return this;
      };
      /**
       * Seeks to the specified time or label. If a undefined label is provided,
       * the call to .seek() is ignored.
       * @param time
       * @public
       */
      TimelineAnimation.prototype.seek = function (time) {
          time = this.getPosition_(time);
          if (time || time === 0) {
              this.currentTime = time;
          }
          if (this.playState !== "running") {
              this.pause();
          }
          return this;
      };
      /**
       * Sets the properties at a given time. This is a convenience method for
       * calling animate with an ease of steps(1, end).
       * @public
       */
      TimelineAnimation.prototype.set = function (targets, props, pos) {
          props["ease"] = "steps(1,end)";
          return this.animate(targets, 0, props, pos);
      };
      /**
       * Creates a target alias that can be referred to in the targets parameter in
       * animate() and set().  It is recommended to prefix the alias with @ to
       * prevent conflicts with CSS selectors. This is useful for creating generic
       * animations where the target is not known when defining the tweens.
       * @param alias
       * @param target
       * @public
       */
      TimelineAnimation.prototype.target = function (alias, target) {
          this.targets[alias] = target;
          return this;
      };
      /**
       * Configure a tween from the (current) position for the duration specified.
       * @param targets The element, object, or selector to animate.
       * @param duration The duration in milliseconds of the tween.
       * @param props The end state properties of the tween.
       * @param pos The position to insert the tween. This defaults to the duration
       * if not specified.
       * @public
       */
      TimelineAnimation.prototype.animate = function (targets, duration, props, pos) {
          pos = this.getPosition_(pos);
          if (pos === undefined) {
              pos = this.duration;
          }
          /* If the target is not a string, create an alias so the keyframe can be
           * stored separatedly from the objects themselves. */
          if (typeof targets !== "string") {
              var targetId = findTarget(this.targets, targets);
              if (!targetId) {
                  targetId = "@auto_" + ++this.targetIds_;
                  this.target(targetId, targets);
              }
              targets = targetId;
          }
          var targetProps = this.keyframes[targets];
          if (!targetProps) {
              targetProps = this.keyframes[targets] = {};
          }
          // Figure out what ease and stagger to use.
          var ease = props.ease || "linear";
          var stagger = props.stagger || 0;
          // tslint:disable-next-line:forin
          for (var prop in props) {
              var value = props[prop];
              if (prop !== "ease" && (value || value === 0)) {
                  var propKeyframes = targetProps[prop];
                  if (!propKeyframes) {
                      propKeyframes = targetProps[prop] = {};
                  }
                  propKeyframes[pos + duration] = {
                      ease: ease,
                      stagger: stagger,
                      value: value
                  };
              }
          }
          return this;
      };
      /**
       * Forces an update. This can be used after updating timing or keyframes in
       * configure() to force an
       */
      TimelineAnimation.prototype.update = function () {
          animate(this);
          return this;
      };
      return TimelineAnimation;
  }());
  function findTarget(targets, target) {
      for (var targetid in targets) {
          if (target === targets[targetid]) {
              return targetid;
          }
      }
  }
  //# sourceMappingURL=timeline.js.map

  function timeline(opts) {
      return new TimelineAnimation(opts);
  }
  //# sourceMappingURL=main.js.map

  exports.timeline = timeline;
  exports.nextAnimationFrame = nextAnimationFrame;
  exports.tick = tick;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
