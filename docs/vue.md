# Vue 2.0 Bindings

Just Animate has bindings to Vue 2.0 that help make animating easy in your markup

## Setup

**Include this additional script after both Just Animate and VueJS**

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/just-animate/1.2.1/just-animate-vue.min.js"></script>
```

**Register Just Animate plugin with VueJS before creating a Vue**

```typescript
Vue.use(just.AnimateVue);
```

## Usage
**Use v-animate instead of v-on to directly use Just Animate mixins on HTML events**

HTML
```html
<div id="app">
    <button v-animate="{ click: 'headShake'} }">{{ message }}</button>
</div>
```

JavaScript

```javascript
var app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!'
  }
});
```

**For small adjustments, pass { } with options from Just Animate**

HTML
```html
<div id="app">
    <button v-animate="{ mouseover: { mixins: 'jello', to: '1.5s' } }">{{ message }}</button>
</div>
```

**Register new animations in JavaScript as mixins**


JavaScript

```javascript
just.register({
    name: 'balloon',
    to: '600ms',
    css: {
        scale: [1, 1.2, 1]
    }
});
```

HTML
```html
<div id="app">
    <button v-animate="{ mouseover: 'balloon' }">{{ message }}</button>
</div>
```

## Future plans

Transitions are next. Can't decide if creating a custom component (just-animate-transition) or if there is a way to tie this in with the v-animate directive.  I would really appreciate some help building out this part.
