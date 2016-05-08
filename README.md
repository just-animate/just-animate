#JustAnimate
*Just animate your websites*

`JustAnimate is an easy to use Animation library that lets you add animations and *just* move on.

## Demos
  - [Basic Animations](http://codepen.io/notoriousb1t/pen/BjgGmY)
  - [Basic Animation with Angular 1.x](http://codepen.io/notoriousb1t/pen/Rrzvjb)
  - [Basic Animation with JQuery](http://codepen.io/notoriousb1t/pen/obrmMr)
  - [Animating Multiple Elements](http://codepen.io/notoriousb1t/pen/Wwevxv)
  - [Registering Custom Animations](http://codepen.io/notoriousb1t/pen/WwNvON)
  
## Getting Started
1. Include these scripts on your document

  ```html
  <script src="https://cdnjs.cloudflare.com/ajax/libs/web-animations/2.1.4/web-animations.min.js"></script>
  <script src="just-animate-core.js"></script>
  <script src="just-animate-animations.js"></script>
  ```
  Just Animate uses the new Web Animations API in JavaScript.  For maximum browser compatibility, this should be included even
  if your browser supports this new standard.
  

2. Call the animation function any of these ways
 ```javascript
  Just.animate('fadeIn', '#animate-me')
 ```

 ```javascript
  Just.animate('fadeIn', document.getElementById('animate-me'))
 ```

   ```javascript
  Just.animate('fadeIn', $('#animate-me'))
  ```

   ```javascript
  Just.animate('fadeIn', function() {
      return document.getElementById('animate-me');
  });
  ```

   ```javascript
  Just.animate('fadeIn', [$('input:checkbox'), document.getElementById('#animate-me')]);
  ```

3. Use the player returned from animate to do more advanced things:
 
 ```javascript
 var player = Just.animate('fadeIn', '#animate-me');
 player.play();
 player.pause();
 player.finish();
 player.reverse();
 player.cancel();
 ```

## Getting Started with Angular 1.x
1. Include these scripts on your document

  ```html
  <script src="https://cdnjs.cloudflare.com/ajax/libs/web-animations/2.1.4/web-animations.min.js"></script>
  <script src="just-animate-core.js"></script>
  <script src="just-animate-animations.js"></script>
  ```
  
2. Import the JustAnimate module into your application
  ```javascript
  angular.module('myApp', ['just.animate']);
  ```

3. Inject the service into your controller or directive

  ```javascript
  angular.module('myApp').controller('myCtrl', function(just) {
    /* logic here */
  });
  ```
  
4. Finally you need to call the animate function
 
  ```javascript
  just.animate('fadeIn', '#animate-me');
  ```

**Full Example**
  ```javascript
  angular.module('myApp', ['just.animate'])
    .controller('myCtrl', function(just) {
      just.animate('fadeIn', '#animate-me');
    });
  ```
  See **Getting Started** above for more information

## Getting Started with Angular 2.x (with SystemJS)
1. Include these scripts in the head of the document after systemjs

  ```html
  <script src="https://cdnjs.cloudflare.com/ajax/libs/web-animations/2.1.4/web-animations.min.js"></script>
  <script src="browser/just-animate-systemjs.js"></script>
  ```
  
2. Import the JustAnimate module into your application and inject the Animate.css animations
  ```typescript
  import { JustAnimate, animations } from 'just-animate';
  
  JustAnimate.inject(animations.ANIMATE_CSS);
  ```

3. Inject the service into your component and call animate()

  ```typescript
  import { Component } from 'angular2/core';
  import { JustAnimate } from 'just-animate';
  
  @Component({
     template: '<div><button (click)="onClick($event)"></button></div>',
     providers: [ JustAnimate ]
  })
  class MyComponent {
    constructor(private just: JustAnimate) { }
    
    onClick($event: Event) {
        this.just.animate('bounceIn', $event.target);
    }
  }
  ```

  See **Getting Started** above for more information

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

## Contributing
Pull requests are the best way.  At this point, I am still developing the core experience, 
but would love to hear suggestions on how to make this better.
