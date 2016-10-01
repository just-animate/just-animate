# JustAnimate

*Just Animate creates beautify animations using the latest browser standards*

Just Animate provides a toolbox of over 75 preset animations and an API that is designed to make motion design flow really well.

## Documentation (needs update!)

Check out the [Full Documentation Here](https://just-animate.github.io)


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
|targets|AnimationTarget|An html selector, an Element, a NodeList, or a jQuery object. This can also be an array of any of those or a function that returns any of those.|
|css|CSSKeyframe[] or CSSProperty|An array of keyframes or an object of properties to animate|
|to|Time|When to stop the animation written as '2s', '2000ms', or 2000|
|from|Time|When to start the animation as '2s', '2000ms', or 2000|
|delay|Time or Function|Time before animation starts as '2s', '2000ms', 2000, or function() { return 2000; }|
|easing|AnimationTimingFunction|Animation timing function (ease, ease-in, easeOutCubic, step(1,end))|
|mixins|string or string[]|A preset or a list of presets to add to the animation(e.g. fadeIn, hinge, zoomOutLeft, etc.)|

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


### Animate multiple elements by using an html selector, JQuery, or an array of targets

 ```javascript
just.animate({
    mixins: 'fadeIn',
    targets: ['#first', '#second']
});
 ```

### Animate targets in sequence by chaining .animate() calls

 ```javascript
just.animate({
      mixins: 'fadeIn',
      targets: ['#first', '#second']
  })
  .animate({
      mixins: 'fadeIn',
      targets: ['#first', '#second']
  });

```


### Animate targets at the same time by passing in an array of options

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

### Animate anything using the update function

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
player.playbackRate(1.2); // changes the playback rate

player.animate({ });      // appends a new animation to this player
player.animate([ ]);      // appends a set of animations to this player
```

## Demos

- [Demo All Mixins](http://codepen.io/notoriousb1t/full/vXZNvm/)
- [Basic Animations](http://codepen.io/notoriousb1t/pen/BjgGmY)
- [Basic Animation with Angular 1.x](http://codepen.io/notoriousb1t/pen/Rrzvjb)
- [Basic Animation with JQuery](http://codepen.io/notoriousb1t/pen/obrmMr)
- [Animating Multiple Elements](http://codepen.io/notoriousb1t/pen/Wwevxv)
- [Registering Custom Animations](http://codepen.io/notoriousb1t/pen/WwNvON)


## License

Just Animate is licensed under the MIT license. (http://opensource.org/licenses/MIT)

## How can you contribute?

 - make awesome things with Just Animate.  If you make it on CodePen or otherwise, send me a link so I can add it to the demos here.
 - create issues if there is a bug or an unexpected behavior (if it isn't reported, it probably won't get fixed)
 - contribute code and help me make this library great!
 - help with documentation.  It takes four times as long at least to build out docs.  When you contribute docs, you are helping out everyone including me.
