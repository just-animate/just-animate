import { ITimeline } from '../lib/core/types'
import { styles } from './styles'
import { template } from './template'
import { find, on } from './dom'

var isInitialized: boolean
var scrubberControl: HTMLInputElement
var scrubberValue: HTMLInputElement
var play: HTMLElement
var pause: HTMLElement
var reverse: HTMLElement
var cancel: HTMLElement
var timeline: ITimeline
var pausedForScrubbing = false

function onValueChanged(t: ITimeline) {
  updateValue(t.currentTime)
}

function updateValue(value: number) {
  value = Math.floor(+value)
  scrubberValue.value = value + ''
  scrubberControl.value = value + ''
}

function onCanceled() {
  scrubberValue.value = '0';
  scrubberControl.value = '0';
}

function onConfig(t: ITimeline) { 
  scrubberControl.setAttribute('max', String(t.duration))
}

function init() {
  var $wrapper = document.createElement('div')
  $wrapper.id = 'ja-controls'
  $wrapper.innerHTML = styles + template
  document.body.appendChild($wrapper)

  scrubberControl = find('ja-scrubber') as HTMLInputElement
  scrubberValue = find('ja-seek') as HTMLInputElement
  play = find('ja-play')
  pause = find('ja-pause')
  reverse = find('ja-reverse')
  cancel = find('ja-cancel')

  scrubberValue.value = '0'

  // update the current value when the slider is dragged
  const scrubberChanged = (evt: Event) => {
    var value = +(evt.currentTarget as HTMLInputElement).value
    timeline.currentTime = value
    updateValue(value)
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
      if (timeline.isPlaying) {
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
    updateValue(value)
  })

  on(play, 'click', () => {
    if (timeline) {
      timeline.play()
    }
  })
  
  on(cancel, 'click', () => {
    if (timeline) {
      timeline.cancel()
      updateValue(0);
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
    // initialize on first bind
    init()
    isInitialized = true
  }

  if (timeline) {
    // unwire subscriptions
    timeline.off('update', onValueChanged)
    timeline.off('cancel', onCanceled)
    timeline.off('config', onConfig)
  }

  // call on config to set initial values
  onConfig(timeline2);
  scrubberControl.value = String(timeline2.currentTime)

  // wire up subscriptions
  timeline2.on('update', onValueChanged)
  timeline2.on('cancel', onCanceled)
  timeline2.on('config', onConfig);
  
  // assign referece to this new timeline
  timeline = timeline2
}
