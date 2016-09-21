#JustAnimate
*Just Animate creates beautify animations using the latest browser standards*

Just Animate provides a toolbox of over 75 preset animations and an API that is designed to make motion design flow really well.

## Documentation (needs update!)

Check out the [Full Documentation Here](https://just-animate.github.io)

## Demos (needs update!)
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
  <script src="just-animate-core.min.js"></script>
  <script src="just-animate-animations.min.js"></script>
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
  <script src="browser/just-animate-systemjs.js"></script>
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
 - Call just.animate()
   - targets: the animation targets.  Can be a html selector, an Element, a NodeList, or a jQuery object. This can also be an array of any of those or a function that returns any of those.
   - keyframes: the same as CSS keyframes
   - to: number of miliseconds until the end of the animation
   - from: number of milliseconds until the animation starts
   - name: adds preset values into the animation (e.g. fadeIn, hinge, zoomOutLeft)
 ```javascript
  just.animate({
    targets: '#animate-me'
    // targets: document.getElementById('animate-me),
    // targets: document.querySelectorAll('#animate-me),
    // targets: $('animate-me),
    // targets: ['#animate-me'],
    // targets: () => document.getElementById('animate-me'),
    keyframes: [
      { opacity: 0 },
      { opacity: 1 }
    ],
    to: '1s'
  })
 ```

 - Use the player returned from animate to do more advanced things:
 
 ```javascript
 var player = just
   // animate multiple elements simultaneously
  .animate({
    name: 'fadeIn',
    targets: ['#first', '#second'],
    to: '1s'
  })
  // animate in sequence
  // animate on a timeline
  .animate([
    {
      name: 'fadeOutLeft',
      targets: '#first',
      to: '2s',
      delay: function() {
        // delay animation for a random # of ms between 0 and 1000
        return Math.random() * 1000;
      }
    },
    {
      name: 'fadeOutRight',
      targets: '#second',
      to: '1.5s',
      delay: 0
    }
  ])
  // sequence animation after existing animation
  .on('finish', () => console.log("I'm finished!"))
  .on('cancel', () => console.log("I'm canceled!"))
  .on('pause', () => console.log("I'm paused!"))
  .on('update', function(delta, runningTime) {
    console.log(delta + 'ms since last update');
  });

player
  .reverse()
  .play()
  .pause()
  .finish()
  .cancel();
 ```


## Included animations

  The animations in just-animate-animations.js are based on Animate.css.  [Check out all the animations here on their page!](https://daneden.github.io/animate.css/)

  * `bounce`
  * `flash`
  * `pulse`
  * `rubberBand`
  * `shake`
  * `headShake`
  * `swing`
  * `tada`
  * `wobble`
  * `jello`
  * `bounceIn`
  * `bounceInDown`
  * `bounceInLeft`
  * `bounceInRight`
  * `bounceInUp`
  * `bounceOut`
  * `bounceOutDown`
  * `bounceOutLeft`
  * `bounceOutRight`
  * `bounceOutUp`
  * `fadeIn`
  * `fadeInDown`
  * `fadeInDownBig`
  * `fadeInLeft`
  * `fadeInLeftBig`
  * `fadeInRight`
  * `fadeInRightBig`
  * `fadeInUp`
  * `fadeInUpBig`
  * `fadeOut`
  * `fadeOutDown`
  * `fadeOutDownBig`
  * `fadeOutLeft`
  * `fadeOutLeftBig`
  * `fadeOutRight`
  * `fadeOutRightBig`
  * `fadeOutUp`
  * `fadeOutUpBig`
  * `flipInX`
  * `flipInY`
  * `flipOutX`
  * `flipOutY`
  * `lightSpeedIn`
  * `lightSpeedOut`
  * `rotateIn`
  * `rotateInDownLeft`
  * `rotateInDownRight`
  * `rotateInUpLeft`
  * `rotateInUpRight`
  * `rotateOut`
  * `rotateOutDownLeft`
  * `rotateOutDownRight`
  * `rotateOutUpLeft`
  * `rotateOutUpRight`
  * `hinge`
  * `rollIn`
  * `rollOut`
  * `zoomIn`
  * `zoomInDown`
  * `zoomInLeft`
  * `zoomInRight`
  * `zoomInUp`
  * `zoomOut`
  * `zoomOutDown`
  * `zoomOutLeft`
  * `zoomOutRight`
  * `zoomOutUp`
  * `slideInDown`
  * `slideInLeft`
  * `slideInRight`
  * `slideInUp`
  * `slideOutDown`
  * `slideOutLeft`
  * `slideOutRight`
  * `slideOutUp`

## License
JustAnimate is licensed under the MIT license. (http://opensource.org/licenses/MIT)

## How can you contribute?

 - make awesome things with Just Animate.  If you make it on Code Pen or otherwise, send me a link so I can put show it off.
 - create issues if there is a bug or an unexpected behavior (if it isn't reported, it probably won't get fixed)
 - contribute code and help me make this library great!
 - help with documentation.  It takes four times as long at least to build out docs.  When you contribute docs, you are helping out everyone including me.
