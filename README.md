# JustAnimate

*Just Animate creates beautiful animations using the latest browser standards*

## Features

- over 75 preset animations
- hardware acceleration on Chrome and FireFox using the Web Animation API
- control multiple animations
- animation sequencing
- animation timelines
- randomness and staggered timing through property resolvers
- full animation control (reverse, pause, cancel, and seek)

## Getting Started
### Setting up the environment
 - For support in Internet Explorer, Edge, or Safari, include this script. Just Animate uses the Web Animation API and is not yet supported in these browsers.
  ```html
  <script src="https://cdnjs.cloudflare.com/ajax/libs/web-animations/2.2.2/web-animations.min.js"></script>
  ```

 - Include the core script and (optionally) the animations script for ready to use animation presets.
  ```html
  <script src="https://cdnjs.cloudflare.com/ajax/libs/just-animate/1.0.0-beta.20160922a/just-animate-core.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/just-animate/1.0.0-beta.20160922a/just-animate-animations.min.js"></script>
  ```
 - That's it!
  
## Usage

|property|type|description|
|:-------------|:-------------|:-------------|
|css|CSSKeyframe[] or CSSProperty|An array of keyframes or an object of properties to animate|
|delay|Time or Function|Time before animation starts as '2s', '2000ms', 2000, or function() { return 2000; }|
|direction|string|Direction of the animation (normal, reverse, alternate)|
|easing|AnimationTimingFunction|Animation timing function (ease, ease-in, easeOutCubic, step(1,end))|
|fill|string|Animation fill mode (none, both, forwards, backwards)|
|from|Time|When to start the animation as '2s', '2000ms', or 2000|
|iterations|number|Number of iterations, defaults to 1|
|mixins|string or string[]|A preset or a list of presets to add to the animation(e.g. fadeIn, hinge, zoomOutLeft, etc.)|
|targets|AnimationTarget|An html selector, an Element, a NodeList, or a jQuery object. This can also be an array of any of those or a function that returns any of those.|
|to|Time|When to stop the animation written as '2s', '2000ms', or 2000|


 ```javascript
  just.animate({
    // css: [
    //   { opacity: 0 },
    //   { opacity: 1 }
    // ],
       css: {
           opacity: [0, 1]
       },

    // delay: '0ms',
    // delay: function(target, index, targets) {
    //     return 10 * index;
    // },

    // direction: 'normal',
    // direction: 'reverse',
    // direction: 'alternate',

    // easing: 'linear',
    // easing: 'cubic-bezier(0, 0, 1, 1)',
    // easing: 'step(1, end)',

    // fill: 'none',
    // fill: 'forwards',
    // fill: 'backwards',
    // fill: 'both',

    // from: 0,
    // from: '0ms',
    // from: '0.002s',

    // iterations: 1,
    // iterations: Infinity,

    // mixins: 'fadeIn',
    // mixins: ['fadeIn'],

       targets: '#animate-me',
    // targets: document.getElementById('animate-me),
    // targets: document.querySelectorAll('#animate-me),
    // targets: $('#animate-me),
    // targets: ['#animate-me'],
    // targets: () => document.getElementById('animate-me'),

    // to: 1000,
    // to: '1000ms',
       to: '1s'
  })
 ```


### Animate multiple targets by using an html selector, JQuery, or an array of targets

 ```javascript
just.animate({
       mixins: 'fadeIn',
       targets: '#animate-me',
    // targets: document.getElementById('animate-me),
    // targets: document.querySelectorAll('#animate-me),
    // targets: $('#animate-me),
    // targets: ['#animate-me'],
    // targets: () => document.getElementById('animate-me'),
    // targets: function() { return document.getElementById('animate-me'); },
});
 ```

### Animate multiple targets in sequence by chaining .animate() calls

 ```javascript
just.animate({
      mixins: 'fadeIn',
      targets: '#first',
  })
  .animate({
      mixins: 'fadeIn',
      targets: '.second'
  });

```


### Use multiple animations at the same time by passing in an array of animation options

  ```javascript
  just.animate([
    {
      mixins: 'fadeOutLeft',
      targets: '#first',
      to: '2s',
      delay() {
        // delay animation for a random # of ms between 0 and 1000
        return Math.random() * 1000;
      }
    },
    {
      mixins: 'fadeOutRight',
      targets: '#second',
      to: '1.5s'
    }
  ]);

```

### Create custom animations or secondary effects using the update function

  ```javascript
just.animate({
    targets: '#first',
    to: '2s',
    update: function(ctx) {
        console.log(ctx.delta);            // delta time since the last update
        console.log(ctx.currentTime);      // current time of animation
        console.log(ctx.relativeDuration); // total duration of the animation (to - from)
        console.log(ctx.offset);           // absolute offset (time) of the animation from 0 to 1
        console.log(ctx.playbackRate);     // current playback rate

        /* COMING SOON! */
        console.log(ctx.computedOffset);   // relative offset (progress) of the animation from 0 to 1
        console.log(ctx.target);           // target of this animation
        console.log(ctx.targetIndex);      // target index of this animation
        console.log(ctx.targets);          // all targets of this animation
        /* COMING SOON! */
    }
});

```

### Animate CSS transforms with easy to use shorthand properties

```javascript
just.animate({
    /* .. */
    css: [{
        perspective: '200px',                // camera distance from the z plane
        matrix:      '1, 1, 1, 1, 1px, 1px', // matrix transform function
        translate:   '20px, 30px',           // X, Y distance from origin
        translate3d: '20px, 30px, 40px'      // X, Y, Z distance from origin
        translateX:  '20px'                  // same as x
        translateY:  '20px'                  // same as y
        translateZ:  '20px'                  // same as z
        x:           '20px',                 // X distance from origin
        y:           '30px',                 // Y distance from origin
        z:           '40px',                 // X distance from origin
        skew:        '20deg',                // X, Y skew function
        skewX:       '20deg',                // X skew function
        skewY:       '20deg',                // Y skew function
        scale:        1.1,                   // X, Y scale
        scale3d:      1.3,                   // X, Y, Z scale
        scaleX:       1,                     // X scale
        scaleY:       1,                     // Y scale
        scaleZ:       1,                     // Z scale
        rotate:      '90deg',                // same as rotateZ
        rotate3d:    '90deg',                // X, Y, Z rotation
        rotateX:     '90deg',                // X rotation
        rotateY:     '90deg',                // Y rotation
        rotateZ:     '90deg'                 // Z rotation
    }]
});
```

#### Notes:
- The properties are evaluated in the order shown here.  I believe the order solves a large number of use cases.  The transform propery can be used directly for other cases. 
- Using aliased properties such as translateX and x together may result in unexpected results


### Use the player returned from .animate() to listen for events or other functions control the animations.

 ```javascript
var player = just.animate(/* ... */);

// event listeners
player.on('finish', function() { }); // fired when the animation finishes or .finish() is called
player.on('cancel', function() { }); // fired when .cancel() is called
player.on('pause',  function() { }); // fired when .pause() is called
player.on('update', function() { }); // fired each update cycle

player.off('finish', function() { } ) // unregisteres a function from .on()

player.cancel();         // cancels animation and resets all properties
player.duration();       // returns duration of the animation (to-from) in milliseconds
player.finish();         // pauses animation and seeks to the end when moving forwards and the beginning when backwards
player.play();           // plays the animation
player.pause();          // pauses the animation
player.playState();      // returns the current play state 'playing', 'paused', etc.
player.reverse();        // reverses the direction of the animation

player.currentTime();    // returns the current time of the animations
player.currentTime(500); // seeks to 500 milliseconds

player.playbackRate();    // returns the current playbackRate
player.playbackRate(2); // changes the playback rate to 2 (2x speed)

player.animate({ });      // appends a new animation to this player
player.animate([ ]);      // appends a set of animations to this player
```

## Demos

- [All Mixins](http://codepen.io/notoriousb1t/full/vXZNvm/)
- [CodePen Demos](http://codepen.io/collection/ANzZxb/)


## License

Just Animate is licensed under the MIT license. (http://opensource.org/licenses/MIT)

## How can you contribute?

 - make awesome things with Just Animate.  If you make it on CodePen or otherwise, send me a link so I can add it to the demos here.
 - create issues if there is a bug or an unexpected behavior (if it isn't reported, it probably won't get fixed)
 - contribute code and help me make this library great!
 - help with documentation.  It takes four times as long at least to build out docs.  When you contribute docs, you are helping out everyone including me.
