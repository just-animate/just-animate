import { ITimeline } from '../lib/types';
var isInitialized: boolean
var scrubberControl: HTMLInputElement
var scrubberValue: HTMLInputElement
var play: HTMLElement
var pause: HTMLElement
var reverse: HTMLElement
var timeline: ITimeline

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
   <button data-ja-rate value=".1">10%</button>
   <button data-ja-rate value=".5">50%</button>
   <button data-ja-rate value="1" class="active">100%</button>
</div>`;

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
   padding: 5px 8px;
}

#ja-controls * { 
   font-family: Arial;
   font-size: 12pt;
   color: white; 
}

#ja-controls > button[data-ja-rate] { 
   font-size: .8em;
}

button[data-ja-rate] {
   background: none;
   border: solid thin rgb(175, 173, 173);
   border-radius: 4px;
   cursor: pointer;
}

button[data-ja-rate]:hover {
   background-color: black;
}

button[data-ja-rate].active {
   background-color: rgb(101, 101, 101); 
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
}
</style>`;

function id(identifier: string) {
  return document.getElementById(identifier) as HTMLElement
}

function on(element: Element, event: string, listener: any) {
  element.addEventListener(event, listener)
}

function onValueChanged(value: number) {
  scrubberValue.value = Math.floor(value) + ''
}

function updateScrubber(time: string | number) {
  var value = Math.round(+time)
  scrubberControl.value = String(value)
  onValueChanged(value)
}

function init() {
  var $wrapper = document.createElement('div')
  $wrapper.id = 'ja-controls';
  $wrapper.innerHTML = stylesTemplate + controlTemplate
  document.body.appendChild($wrapper)

  scrubberControl = id('ja-scrubber') as HTMLInputElement
  scrubberValue = id('ja-seek') as HTMLInputElement
  play = id('ja-play')
  pause = id('ja-pause')
  reverse = id('ja-reverse')

  scrubberValue.value = '0'

  // update the current value when the slider is dragged
  on(scrubberControl, 'input', (evt: Event) => {
    var value = +(evt.currentTarget as HTMLInputElement).value
    timeline.currentTime = value
    onValueChanged(value)
  });

  on(scrubberValue, 'input', (evt: Event) => {
    var value = +(evt.currentTarget as HTMLInputElement).value
    timeline.currentTime = value
    onValueChanged(value)
  })

  on(play, 'click', () => {
    if (timeline) {
      timeline.play()
    }
  });

  on(pause, 'click', () => {
    if (timeline) {
      timeline.pause()
    }
  });

  on(reverse, 'click', () => {
    if (timeline) {
      timeline.reverse()
    }
  })

  const rates = [].slice.call(document.querySelectorAll('#ja-controls [data-ja-rate]')) as HTMLButtonElement[]
  rates.forEach(rate => {
    on(rate, 'click', () => {
      // toggle off other actives and toggle on this active
      rates.forEach(rate2 => rate2.classList.remove('active'))
      rate.classList.add('active')

      if (timeline) {
        const sign = timeline.playbackRate < 0 ? -1 : 1
        console.log(sign)
        timeline.playbackRate = (+rate.value) * sign
      }
    })
  })
}

export function player(timeline2: ITimeline) {
  if (!isInitialized) {
    init();
    isInitialized = true
  }

  if (timeline) {
    timeline.off('update', updateScrubber)
  }

  scrubberControl.setAttribute('max', String(timeline2.duration))
  scrubberControl.value = String(timeline2.currentTime)
  timeline2.on('update', updateScrubber)
  timeline = timeline2
} 
