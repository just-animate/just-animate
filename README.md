# JustAnimate

*Just Animate creates beautify animations using the latest browser standards*

Just Animate provides a toolbox of over 75 preset animations and an API that is designed to make motion design flow really well.

## Documentation (needs update!)

Check out the [Full Documentation Here](https://just-animate.github.io)

## Demos (needs update!)
  - [Demo All Mixins](http://codepen.io/notoriousb1t/full/vXZNvm/)
  - [Basic Animations](http://codepen.io/notoriousb1t/pen/BjgGmY)
  - [Basic Animation with Angular 1.x](http://codepen.io/notoriousb1t/pen/Rrzvjb)
  - [Basic Animation with JQuery](http://codepen.io/notoriousb1t/pen/obrmMr)
  - [Animating Multiple Elements](http://codepen.io/notoriousb1t/pen/Wwevxv)
  - [Registering Custom Animations](http://codepen.io/notoriousb1t/pen/WwNvON)

  
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

### Using Just Animate as an Angular 1.x Service
 - Import the JustAnimate module into your application
  ```javascript
  angular.module('myApp', ['just.animate']);
  ```

 - Inject the service into your controller or directive

  ```javascript
  angular.module('myApp').controller('myCtrl', function(just) {
    /* logic here */
  });
  ```
  
### Using Just Animate as an Angular 2 Service

 - For debugging, include this script after systemjs instead of the core and animation scripts above

  ```html
  <script src="https://cdnjs.cloudflare.com/ajax/libs/just-animate/1.0.0-beta.20160922a/just-animate-systemjs.min.js"></script>
  ```
 - Import the JustAnimate module into your application and inject the Animate.css animations
  ```typescript
  import { JustAnimate, animations } from 'just-animate';
  
  JustAnimate.inject(animations.ANIMATE_CSS);
  ```

- Inject the service into your component as a provider
  ```typescript
  import { Component } from 'angular2/core';
  import { JustAnimate } from 'just-animate';
  
  @Component({
     providers: [ JustAnimate ]
  })
  class MyComponent {
    /* more code */
  }
  ```
  
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
    targets: '#animate-me'
    // targets: document.getElementById('animate-me),
    // targets: document.querySelectorAll('#animate-me),
    // targets: $('animate-me),
    // targets: ['#animate-me'],
    // targets: () => document.getElementById('animate-me'),
    // mixins: 'fadeIn',
    // mixins: ['fadeIn'],
    css: [
      { opacity: 0 },
      { opacity: 1 }
    ],
    //css: {
    //  opacity: [0, 1]
    //},
    to: '1s'
  })
 ```


 - Use the player returned from animate to do more advanced things:
 
 ```javascript
 var player = just
   // animate multiple elements simultaneously
  .animate({
    mixins: 'fadeIn',
    targets: ['#first', '#second'],
    to: '1s'
  })
  // animate in sequence
  // animate on a timeline
  .animate([
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
  ])
  // sequence animation after existing animation
  .on('finish', () => console.log("I'm finished!"))
  .on('cancel', () => console.log("I'm canceled!"))
  .on('pause', () => console.log("I'm paused!"))
  .on('update', function(ctx) {
    console.log(ctx.delta + 'ms since last update');
  });

player
  .reverse()
  .play()
  .pause()
  .finish()
  .cancel();
 ```

## License

JustAnimate is licensed under the MIT license. (http://opensource.org/licenses/MIT)

## How can you contribute?

 - make awesome things with Just Animate.  If you make it on CodePen or otherwise, send me a link so I can put show it off.
 - create issues if there is a bug or an unexpected behavior (if it isn't reported, it probably won't get fixed)
 - contribute code and help me make this library great!
 - help with documentation.  It takes four times as long at least to build out docs.  When you contribute docs, you are helping out everyone including me.
