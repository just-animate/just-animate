#JustAnimate
*Just animate your websites*

`JustAnimate is an easy to use Animation library that lets you add animations and *just* move on.

##Basic Usage
1. Include these scripts on your document

  ```html
  <script src="web-animations.min.js"></script>
  <script src="just-animate.js"></script>
  ```
  Just Animate uses the new Animations API in JavaScript.  For maximum browser compatibility, this should be included even
  if your browser supports this new standard.
  
2. Select the element you want to animate.

  ```javascript
  var element = document.getElementById('animate-me');
  ```

3. Finally you need to call the animation function

  **Full example:**
  ```javascript
  var element = document.getElementById('animate-me');
  Just.animate('fadeIn', element)
  ```
  
  **Shorthand example:**
  ```javascript
  var element = document.getElementById('animate-me');
  Just.fadeIn(element)
  ```
  
  Each animation name has a shorthand function that can be called instead of .animate('animation.name.here')


##AngularJS 1.x Usage
1. Include these scripts on your document

  ```html
  <script src="web-animations.min.js"></script>
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

4. Select the element you want to animate.

  ```javascript
  var element = angular.element('#animate-me')[0];
  ```
  
5. Finally you need to call the animation function

  **Full example:**
  ```javascript
  angular.module('myApp', ['just.animate'])
    .controller('myCtrl', function(just) {
      var element = angular.element('#animate-me')[0];
      just.animate('fadeIn', element);
    });
  ```
  
  **Shorthand example:**
  ```javascript
  angular.module('myApp', ['just.animate'])
    .controller('myCtrl', function(just) {
      var element = angular.element('#animate-me')[0];
      just.fadeIn(element);
    });
  ```
  
  Each animation name has a shorthand function that can be called instead of .animate('animation.name.here')

##JQuery Usage
1. Include these scripts on your document

  ```html
  <script src="web-animations.min.js"></script>
  <script src="just-animate-jquery.js"></script>
  ```
  
2. Select the element you want to animate and call .justAnimate('animate.name.here')

  ```javascript
  $('#animate-me').justAnimate('fadeIn');
  ```

## Built animations

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
