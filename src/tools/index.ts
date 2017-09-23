import { ITimeline } from '../lib/core/types'

var isInitialized: boolean
var scrubberControl: HTMLInputElement
var scrubberValue: HTMLInputElement
var play: HTMLElement
var pause: HTMLElement
var reverse: HTMLElement
var timeline: ITimeline
var pausedForScrubbing = false

const controlTemplate = `<div id="ja-controls">
   <div id="ja-play">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
         <path d="M3 22v-20l18 10-18 10z"/>
      </svg>
   </div>
   <div id="ja-pause">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
         <path d="M11 22h-4v-20h4v20zm6-20h-4v20h4v-20z"/>
      </svg>
   </div>
   <div id="ja-reverse">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
         <path d="M6 13v4l-6-5 6-5v4h3v2h-3zm9-2v2h3v4l6-5-6-5v4h-3zm-4-6v14h2v-14h-2z"/>
      </svg>
   </div>
   <input id="ja-scrubber" type="range" min="0" step="1" max="1000" value="0" />
   <input id="ja-seek" type="number" placeholder="0ms" />
   <div>
      <button data-ja-rate value=".1">10%</button>
      <button data-ja-rate value=".5">50%</button>
      <button data-ja-rate value="1" class="active">100%</button>
   </div>
</div>`

const colorFillLower = '#2a6495'
const colorFillUpper = '#7AC7C4'
const boxShadow1 = '1px 1px 1px #000000, 0px 0px 1px #0d0d0d'
const thumbHeight = '24px'
const thumbWidth = '4px'
const trackHeight = '4px'
const thumbColor = '#9ba6c0'
const border = '0.2px solid #010101'

const stylesTemplate = `<style style="display:none">
#ja-controls { 
   position: fixed;
   bottom: 10px;
   right: 10px;
   background-color: rgba(0, 0, 0, .8);
   border: solid thin rgba(255, 255, 255, .4);
   border-radius: 5px;
   padding: 0;
}

#ja-controls > * { 
   vertical-align: middle;
   display: inline-block;
   padding: 2px 5px;
}

#ja-controls button[data-ja-rate] {
   background: none;
   border: solid thin rgb(175, 173, 173);
   font-size: .8em;
   border-radius: 4px;
   cursor: pointer;
}

#ja-controls button[data-ja-rate]:hover {
   background-color: black;
}

#ja-controls button[data-ja-rate].active {
   background-color: #4f5d7d; 
}
#ja-controls path {
    fill: currentColor;
}
#ja-play, #ja-pause, #ja-reverse {
   height: 1em;
   width: 1em;
   cursor: pointer;
}
#ja-seek {
   width: 50px;
   text-align: right; 
   font-size: .8em;
   color: white;
   background-color: transparent;
   border: none;
   -moz-appearance: textfield;
} 

#ja-seek::-webkit-inner-spin-button, 
#ja-seek::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}

#ja-controls * { 
   font-family: Arial;
   font-size: 12pt;
   color: white; 
}
#ja-controls > button[data-ja-rate] { 
   font-size: .8em;
}

#ja-controls > input[type=range] {
  -webkit-appearance: none;
  padding: 0;
  height: 30px;
  background-color: transparent;
}
#ja-controls > input[type=range]:focus {
  outline: none;
}
#ja-controls > input[type=range]::-webkit-slider-runnable-track {
  width: 100%;
  height: ${trackHeight};
  cursor: pointer;
  animate: 0.2s;
  box-shadow: ${boxShadow1};
  background: ${colorFillUpper};
  border-radius: 1.3px;
  border: ${border};
}
#ja-controls > input[type=range]::-webkit-slider-thumb {
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  border: ${border};
  height: ${thumbHeight};
  width: ${thumbWidth};
  border-radius: 3px;
  background: ${thumbColor};
  cursor: pointer;
  -webkit-appearance: none;
  margin-top: -10px;
}
#ja-controls > input[type=range]:focus::-webkit-slider-runnable-track {
  background: ${colorFillUpper};
}
#ja-controls > input[type=range]::-moz-range-track {
  width: 100%;
  height: ${trackHeight};
  cursor: pointer;
  animate: 0.2s;
  box-shadow:  ${boxShadow1};
  background: ${colorFillUpper};
  border-radius: 1.3px;
  border: ${border};
}
#ja-controls > input[type=range]::-moz-range-thumb {
  box-shadow: 1px 1px 1px #000000, 0px 0px 1px #0d0d0d;
  border: ${border};
  height: ${thumbHeight};
  width: ${thumbWidth};
  border-radius: 3px;
  background: ${thumbColor};
  cursor: pointer;
}
#ja-controls > input[type=range]::-ms-track {
  width: 100%;
  height: ${trackHeight};
  cursor: pointer; 
  background: transparent;
  border-color: transparent;
  border-width: 16px 0;
  color: transparent;
}
#ja-controls > input[type=range]::-ms-fill-lower {
  background: ${colorFillLower};
  border: ${border};
  border-radius: 2.6px;
  box-shadow: ${boxShadow1};
}
#ja-controls > input[type=range]::-ms-fill-upper {
  background: ${colorFillUpper};
  border: ${border};
  border-radius: 2.6px;
  box-shadow:  ${boxShadow1};
}
#ja-controls > input[type=range]::-ms-thumb {
  box-shadow: ${boxShadow1};
  border: ${border};
  height: ${thumbHeight};
  width: ${thumbWidth};
  margin-top: 1px;
  border-radius: 3px;
  background: #ffffff;
  cursor: pointer;
}
#ja-controls > input[type=range]:focus::-ms-fill-lower {
  background: ${colorFillUpper};
}
#ja-controls > input[type=range]:focus::-ms-fill-upper {
  background: ${colorFillUpper};
}

</style>`

function id(identifier: string) {
  return document.getElementById(identifier) as HTMLElement
}

function on(element: Element, event: string, listener: any) {
  element.addEventListener(event, listener)
}

function onValueChanged(value: number) {
  value = Math.floor(+value)
  scrubberValue.value = value + ''
  scrubberControl.value = value + ''
}

function init() {
  var $wrapper = document.createElement('div')
  $wrapper.id = 'ja-controls'
  $wrapper.innerHTML = stylesTemplate + controlTemplate
  document.body.appendChild($wrapper)

  scrubberControl = id('ja-scrubber') as HTMLInputElement
  scrubberValue = id('ja-seek') as HTMLInputElement
  play = id('ja-play')
  pause = id('ja-pause')
  reverse = id('ja-reverse')

  scrubberValue.value = '0'

  // update the current value when the slider is dragged
  const scrubberChanged = (evt: Event) => {
    var value = +(evt.currentTarget as HTMLInputElement).value
    timeline.currentTime = value
    onValueChanged(value)
  }

  on(scrubberControl, 'input', scrubberChanged)
  on(scrubberControl, 'change', scrubberChanged)

  on(scrubberValue, 'mousedown', () => {
    if (timeline) {
      timeline.pause()
    }
  })

  on(scrubberControl, 'mousedown', () => {
    if (timeline) {
      if (timeline.state === 3 /* running */) {
        pausedForScrubbing = true
      }
      timeline.pause()
    }
  })

  on(scrubberControl, 'mouseup', () => {
    if (timeline && pausedForScrubbing) {
      pausedForScrubbing = false
      timeline.play()
    }
  })

  on(scrubberValue, 'input', (evt: Event) => {
    var value = +(evt.currentTarget as HTMLInputElement).value
    timeline.currentTime = value
    onValueChanged(value)
  })

  on(play, 'click', () => {
    if (timeline) {
      timeline.play()
    }
  })

  on(pause, 'click', () => {
    if (timeline) {
      timeline.pause()
    }
  })

  on(reverse, 'click', () => {
    if (timeline) {
      timeline.reverse()
    }
  })

  const rates = [].slice.call(document.querySelectorAll('#ja-controls [data-ja-rate]'))

  rates.forEach((rate: HTMLButtonElement) => {
    on(rate, 'click', () => {
      // toggle off other actives and toggle on this active
      rates.forEach((rate2: HTMLButtonElement) => rate2.classList.remove('active'))
      rate.classList.add('active')

      if (timeline) {
        const sign = timeline.playbackRate < 0 ? -1 : 1
        timeline.playbackRate = +rate.value * sign
      }
    })
  })
}

export function player(timeline2: ITimeline) {
  if (!isInitialized) {
    init()
    isInitialized = true
  }

  if (timeline) {
    timeline.off('update', onValueChanged)
  }

  scrubberControl.setAttribute('max', String(timeline2.duration))
  
  scrubberControl.value = String(timeline2.currentTime)
  timeline2.on('update', onValueChanged)
  timeline2.on('config', () => {
    scrubberControl.setAttribute('max', String(timeline2.duration))
  });
  
  timeline = timeline2
}
