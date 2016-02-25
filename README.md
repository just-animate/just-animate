#JustAnimate
*Just animate your websites*

`JustAnimate is an easy to use Animation library that lets you add animations and *just* move on.

## Demos

  * [Basic Demo](http://codepen.io/notoriousb1t/pen/BjgGmY)
  * [Angular 1.x Demo](http://codepen.io/notoriousb1t/pen/Rrzvjb)
  * [JQuery Demo](http://codepen.io/notoriousb1t/pen/obrmMr)

##Getting Started
1. Include these scripts on your document

  ```html
  <script src="https://cdnjs.cloudflare.com/ajax/libs/web-animations/2.1.4/web-animations.min.js"></script>
  <script src="just-animate.js"></script>
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

3. Use shorthand functions to make it easy to read.  All animations can be called as functions 

  ```javascript
  Just.fadeIn('#animate-me');
  Just.fadeOut('#animate-me');
  Just.bounceIn('#animate-me');
  /* ... */
  ```

4. Use the player returned from animate to do more advanced things with these functions:

 a. finish
 b. play
 c. pause
 d. reverse
 e. cancel


##Getting Started with Angular 1.x
1. Include these scripts on your document

  ```html
  <script src="https://cdnjs.cloudflare.com/ajax/libs/web-animations/2.1.4/web-animations.min.js"></script>
  <script src="just-animate-angular.js"></script>
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

## Included animations

  The animations in JustAnimate are based on Animate.css.  [Check out all the animations here on their page!](https://daneden.github.io/animate.css/)

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
Pull requests are the best way.  At this point, I am still developing the core experience, but would love to hear suggestions on how to make this better.
