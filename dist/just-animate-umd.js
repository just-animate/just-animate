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
   * Finds the index before the provided value in the list of numbers.
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

  function readAttribute(target, key) {
      return target.getAttribute(key) || "";
  }
  function writeAttribute(target, key, value) {
      target.setAttribute(key, value.toString());
  }

  function readCssVar(target, key) {
      return target.style.getPropertyValue(key);
  }
  function writeCssVar(target, key, value) {
      target.style.setProperty(key, value.toString());
  }

  function readStyle(target, key) {
      return getComputedStyle(target)[key];
  }
  function writeStyle(target, key, value) {
      target.style[key] = value;
  }

  function readProperty(target, key) {
      return target[key];
  }
  function writeProperty(target, key, value) {
      target[key] = value;
  }

  var DELIMITER_REGEX = /^\s*[\(\),\/\s]\s*/;
  var HEX_REGEX = /^#[a-f\d]{3,6}/i;
  var KEYWORD_REGEX = /^[a-z][a-z\d\-]*/i;
  var NUMBER_REGEX = /^\-?\d*\.?\d+/;
  var UNIT_REGEX = /^\-?\d*\.?\d+[a-z%]+/i;
  var PATH_COMMAND_REGEX = /^[mhvlcsqt]/i;
  var NUMBER = 1, UNIT = 2, KEYWORD = 3, FUNCTION = 4, DELIMITER = 5;
  function clearContext(ctx, value) {
      ctx.match = "";
      ctx.pos = ctx.last = ctx.state = 0;
      ctx.pattern = value;
  }
  function match(ctx, regex) {
      var match = regex.exec(ctx.pattern.substring(ctx.pos));
      if (match) {
          ctx.match = match[0];
          ctx.last = ctx.pos;
          ctx.pos += ctx.match.length;
      }
      return match != null;
  }

  function hexToRgb(hex) {
      // Parse 3 or 6 hex to an integer using 16 base.
      var h = parseInt(hex.length === 3
          ? hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
          : hex, 16);
      var r = (h >> 16) & 0xff;
      var g = (h >> 8) & 0xff;
      var b = h & 0xff;
      return "rgba(" + r + "," + g + "," + b + ",1)";
  }

  function nextToken(ctx) {
      if (match(ctx, DELIMITER_REGEX)) {
          return DELIMITER;
      }
      if ((ctx.isPath && match(ctx, PATH_COMMAND_REGEX)) ||
          match(ctx, KEYWORD_REGEX)) {
          var isFunction = !ctx.isPath &&
              ctx.pos < ctx.pattern.length - 1 &&
              ctx.pattern[ctx.pos] === "(";
          if (!isFunction) {
              return KEYWORD;
          }
          if (ctx.match.toLowerCase() === "rgb") {
              var searchString = ctx.pattern.substring(ctx.pos);
              var endOfString = searchString.indexOf(")");
              var terms = searchString.substring(1, endOfString);
              ctx.pattern =
                  ctx.pattern.substring(0, ctx.pos + 1 + terms.length) +
                      ",1" +
                      ctx.pattern.substring(ctx.pos + 1 + terms.length);
              ctx.match = "rgba";
          }
          return FUNCTION;
      }
      if (!ctx.isPath && match(ctx, UNIT_REGEX)) {
          return UNIT;
      }
      if (match(ctx, NUMBER_REGEX)) {
          return NUMBER;
      }
      if (match(ctx, HEX_REGEX)) {
          // If the value was hex, replace it with RGB in the string and parse that.
          var hexValue = ctx.pattern.substring(ctx.last + 1, ctx.pos);
          ctx.pattern =
              ctx.pattern.substring(0, ctx.last) +
                  hexToRgb(hexValue) +
                  ctx.pattern.substring(ctx.pos);
          // Reset the position and chain another call to nextToken.
          ctx.pos = ctx.last;
          return nextToken(ctx);
      }
  }

  function nextToken$1(ctx) {
      if (match(ctx, DELIMITER_REGEX)) {
          return DELIMITER;
      }
      if (match(ctx, NUMBER_REGEX)) {
          return NUMBER;
      }
      if (match(ctx, UNIT_REGEX)) {
          return UNIT;
      }
      if (match(ctx, KEYWORD_REGEX)) {
          return FUNCTION;
      }
  }

  var UNIT_EXTRACTOR_REGEX = /([a-z%]+)/i;
  var PATH_REGEX = /^m[\s,]*-?\d*\.?\d+/i;
  var TRANSFORM_REGEX = 
  // Match on all transform functions.
  /(perspective|matrix(3d)?|skew[xy]?|(translate|scale|rotate)([xyz]|3d)?)\(/i;
  /**
   * This mixer attempts to automatically parse CSS expressions from each value
   * and then create an interpolated value from it.
   * @param valueA The left value to mix.
   * @param valueB The right value to mix.
   * @param offset The progression offset to use.
   */
  function autoMix(valueA, valueB, offset) {
      if (isNumeric(valueA) && isNumeric(valueB)) {
          return mixNumber(+valueA, +valueB, offset);
      }
      // If the right is a transform list and the left is not, create net-0
      // transform list on the left that mirrors the right. This allows for tweening
      // values like none or empty string for the initial keyframe.
      if (TRANSFORM_REGEX.test(valueB.toString()) &&
          !TRANSFORM_REGEX.test(valueA.toString())) {
          valueA = negateTransformList(valueB.toString());
      }
      // If value A or B is null or undefined, swap to empty string.
      if (valueA == null) {
          valueA = "";
      }
      if (valueB == null) {
          valueB = "";
      }
      return mix(valueA.toString(), valueB.toString(), offset);
  }
  var ctxTransform = {};
  function negateTransformList(value) {
      clearContext(ctxTransform, value);
      var token;
      var fn;
      var termCount = 0;
      var output = "";
      while (true) {
          token = nextToken$1(ctxTransform);
          if (!token) {
              // Exit when there is nothing left to do.
              break;
          }
          if (token === FUNCTION) {
              // Use functions to start over counting numbers/units.
              fn = ctxTransform.match.toLowerCase();
              termCount = 0;
          }
          if (token !== UNIT && token !== NUMBER) {
              // If a number or unit, pass content through.
              output += ctxTransform.match;
              continue;
          }
          if (fn === "matrix") {
              // Scale defaults to 1 (position 0 and 3)
              output += termCount % 3 ? "0" : "1";
          }
          else if (fn === "matrix3d") {
              // Scale defaults to 1.
              // Example net-0 3d matrix:
              // 1 0 0 0
              // 0 1 0 0
              // 0 0 1 0
              // 0 0 0 1
              output += termCount % 5 ? "0" : "1";
          }
          else if (/scale([xyz]|3d)?/i.test(fn)) {
              output += "1";
          }
          else {
              output += "0";
          }
          termCount++;
      }
      return output;
  }
  var ctxLeft = {};
  var ctxRight = {};
  /**
   * Mixes a css or path expression.
   * @param {string} left
   * @param {string} right
   * @param {number} progress
   */
  function mix(left, right, progress) {
      // Reuse contexts to process this request.
      clearContext(ctxLeft, left);
      clearContext(ctxRight, right);
      // Identify if these are paths.
      ctxLeft.isPath = PATH_REGEX.test(left);
      ctxRight.isPath = PATH_REGEX.test(right);
      var output = "";
      var rgbChannelsRemaining = 0;
      var tokenLeft;
      var tokenRight;
      while (true) {
          tokenLeft = nextToken(ctxLeft);
          tokenRight = nextToken(ctxRight);
          if (!tokenLeft || !tokenRight) {
              break;
          }
          var termLeft = ctxLeft.match;
          var termRight = ctxRight.match;
          if (tokenLeft === NUMBER && tokenRight === NUMBER) {
              var numericTerm = void 0;
              if (rgbChannelsRemaining) {
                  numericTerm = mixRgbChannel(+termLeft, +termRight, progress);
                  rgbChannelsRemaining--;
              }
              else {
                  numericTerm = mixNumber(+termLeft, +termRight, progress);
              }
              output += numericTerm;
          }
          else if (tokenLeft === UNIT || tokenRight === UNIT) {
              var unitMatch = UNIT_EXTRACTOR_REGEX.exec(tokenLeft === UNIT ? termLeft : termRight);
              var unit = unitMatch[1];
              var isWholeNumber = unit === "px";
              var unitLeft = parseFloat(termLeft);
              var unitRight = parseFloat(termRight);
              var numericTerm = mixNumber(unitLeft, unitRight, progress, isWholeNumber);
              // The parseFloat should remove px & % automatically
              output += numericTerm + unit;
          }
          else {
              var term = progress < 0.5 ? termLeft : termRight;
              var isRgbFunction = tokenLeft === FUNCTION &&
                  tokenRight === FUNCTION &&
                  (term === "rgb" || term === "rgba");
              if (isRgbFunction) {
                  rgbChannelsRemaining = 3;
              }
              output += term;
          }
      }
      return output;
  }
  /**
   * Mixes two numeric terms.
   * @param left The left side of the mix operation.
   * @param right The right side of the mix operation.
   * @param progress The progression between left and right.
   * @param precision The precision expressed a multiple of 10. Ex: 3 precision
   *    would be 100.
   */
  function mixNumber(left, right, progress, isWholeNumber) {
      var n = left + (right - left) * progress;
      return isWholeNumber ? Math.round(n) : n;
  }
  /**
   * Mixes two RGB channels. In order to match CSS color interpolation, the terms
   * need to first be squared, then multiplied by the progress, then finally,
   * unsquared.
   * @param left The left side of the mix operation.
   * @param right The right side of the mix operation.
   * @param progress The progression between left and right.
   */
  function mixRgbChannel(left, right, progress) {
      return Math.round(Math.sqrt(Math.min(Math.max(0, (left * left + right * right) * progress), 255 * 255)));
  }

  var PROPERTY = 0, CSS_VAR = 1, ATTRIBUTE = 2, STYLE = 3;
  var htmlAttributeOnly = ["viewBox"];
  var htmlPropOnly = ["innerHTML", "textContent"];
  function detectTargetType(target, propertyName) {
      var isProbablyHTMLElement = typeof target.tagName === "string" &&
          target.style;
      if (!isProbablyHTMLElement) {
          return PROPERTY;
      }
      if (propertyName.indexOf("--") === 0) {
          return CSS_VAR;
      }
      if (htmlAttributeOnly.indexOf(propertyName) !== -1) {
          return ATTRIBUTE;
      }
      if (htmlPropOnly.indexOf(propertyName) !== -1) {
          return PROPERTY;
      }
      return STYLE;
  }
  /**
   * Returns a reader for the given targetType.
   */
  function getReader(targetType) {
      if (targetType === ATTRIBUTE) {
          return readAttribute;
      }
      if (targetType === CSS_VAR) {
          return readCssVar;
      }
      if (targetType === STYLE) {
          return readStyle;
      }
      return readProperty;
  }
  /**
   * Returns a writer for the given targetType.
   */
  function getWriter(targetType) {
      if (targetType === ATTRIBUTE) {
          return writeAttribute;
      }
      if (targetType === CSS_VAR) {
          return writeCssVar;
      }
      if (targetType === STYLE) {
          return writeStyle;
      }
      return writeProperty;
  }
  /**
   * Returns a mixers for the given targetType.
   */
  function getMixer(_targetType) {
      return autoMix;
  }

  function getValueFromCache(target, propName) {
      if (target["__ja"]) {
          return target["__ja"][propName];
      }
  }
  function putValueInCache(target, propName, value) {
      if (!target["__ja"]) {
          target["__ja"] = {};
      }
      target["__ja"][propName] = value;
  }

  var FRAME_SIZE = 1000 / 60;
  var queue = [];
  var lastTime;
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
      var configs = queue.slice();
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
      // // Write configurations back to their configurators.
      // for (let i = 0; i < queue.length; i++) {
      //   queue[i].configure(configs[i]);
      // }
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
                  // Unpack these immediately because the return object is shared.
                  var targetType = detectTargetType(target, propName);
                  var read = getReader(targetType);
                  var write = getWriter(targetType);
                  var mix = getMixer(targetType);
                  var currentValue = read(target, propName);
                  var lowerIndex = findLowerIndex(times, currentTime);
                  var lowerTime = lowerIndex === -1 ? 0 : times[lowerIndex];
                  var lowerFrame = property[times[lowerIndex]];
                  // Get the final value. This can be done for all targets.
                  var upperIndex = Math.min(lowerIndex + 1, times.length - 1);
                  var upperTime = times[upperIndex];
                  var upperValue = property[upperTime].value;
                  // Attempt to load initial value from cache or add the current as init.
                  var lowerValue = void 0;
                  if (!lowerFrame) {
                      var initialValue = getValueFromCache(target, propName);
                      if (initialValue == null) {
                          initialValue = currentValue;
                          putValueInCache(target, propName, currentValue);
                      }
                      lowerValue = initialValue;
                  }
                  else {
                      lowerValue = lowerFrame.value;
                  }
                  // Get the current value and calculate the next value, only attempt to
                  // render if they are different. It is assumed that the cost of reading
                  // constantly is less than the cost of writing constantly.
                  var offset = (lowerTime - currentTime) / (lowerTime - upperTime);
                  var value = mix(lowerValue, upperValue, offset);
                  if (currentValue !== value) {
                      // Queue up the rendering of the value.
                      operations.push(function () { return write(target, propName, value); });
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

  var TimelineAnimation = /** @class */ (function () {
      function TimelineAnimation(options) {
          this.alternate = false;
          this.currentTime = 0;
          this.events = [];
          this.iterations = 1;
          this.keyframes = {};
          this.labels = {};
          this.listeners = {};
          this.playState = "running";
          this.playbackRate = 1;
          this.targetIds_ = 0;
          this.targets = {};
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
              for (var _i = 0, _a = this.timelines_; _i < _a.length; _i++) {
                  var timeline = _a[_i];
                  var endTime = timeline.animation.duration + timeline.pos;
                  if (endTime > duration) {
                      duration = endTime;
                  }
              }
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
          return this.update();
      };
      /**
       * Cancels the animation. The currentTime is set to 0 and the playState is set
       * to 'idle'.
       * @public
       */
      TimelineAnimation.prototype.cancel = function () {
          this.playState = "cancel";
          this.events.push("cancel");
          return this.update();
      };
      /**
       * Restores the state. This method can also be used to declaratively configure
       * the animation instead of using animate, set, etc.
       * @param json The state to restore.
       * @public
       */
      TimelineAnimation.prototype.configure = function (json) {
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
          return this.update();
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
          return this.update();
      };
      /**
       * Plays the animation.
       * @public
       */
      TimelineAnimation.prototype.play = function () {
          this.playState = "running";
          this.events.push("play");
          return this.update();
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
          // If this is running, pause; otherwise ensure an update occurs.
          return this.playState !== "running" ? this.pause() : this.update();
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
          // If targets change, ensure update in case a target has been replaced.
          return this.update();
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
                  targetId = "@_" + ++this.targetIds_;
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
                      value: value
                  };
              }
          }
          return this.update();
      };
      /**
       * Forces an update. This can be used after updating timing or keyframes in
       * configure() to force an
       */
      TimelineAnimation.prototype.update = function () {
          queueTransition(this);
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

  function animate(targets, duration, props) {
      return new TimelineAnimation().animate(targets, duration, props);
  }
  function timeline(opts) {
      return new TimelineAnimation(opts);
  }

  exports.animate = animate;
  exports.timeline = timeline;
  exports.nextAnimationFrame = nextAnimationFrame;
  exports.tick = tick;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
