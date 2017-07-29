import { ITimeline } from '../lib/types'
var isInitialized: boolean
var scrubberControl: HTMLInputElement
var scrubberValue: HTMLElement
var play: HTMLButtonElement
var pause: HTMLButtonElement
var reverse: HTMLButtonElement
var timeline: ITimeline

function onValueChanged(value: number) {
  scrubberValue.textContent = value + ' ms'
}

function newElement(tagName: string, attributes: {}, styles: {}) {
  var el = document.createElement(tagName)
  if (attributes) {
    for (var attKey in attributes) {
      el.setAttribute(attKey, attributes[attKey])
    }
  }
  if (styles) {
    for (var styleKey in styles) {
      el.style[styleKey] = styles[styleKey]
    }
  }
  return el
}

function updateScrubber(time: number) {
  var value = Math.round(+time)
  scrubberControl.value = String(value)
  onValueChanged(value)
}

function init() {
  if (isInitialized) {
    return
  }
  
  var $wrapper = document.body.appendChild(
    newElement('div', undefined, {
      unset: 'all',
      position: 'fixed',
      bottom: '5px',
      right: '5px',
      marginLeft: '-25%',
      width: '200px',
      textAlign: 'center'
    })
  )

  var $scrubberContainer = $wrapper.appendChild(
    newElement('div', undefined, {
      display: 'flex',
      justifyContent: 'stretch'
    })
  )

  scrubberControl = $scrubberContainer.appendChild(
    newElement(
      'input',
      {
        type: 'range',
        step: 1,
        min: 1
      },
      {
        flexBasis: 'auto',
        flexShrink: 1,
        flexGrow: 1
      }
    )
  ) as HTMLInputElement

  scrubberValue = $scrubberContainer.appendChild(
    newElement('div', undefined, {
      flexBasis: 'inherit',
      flexShrink: 0,
      flexGrow: 0
    })
  )
  scrubberValue.innerHTML = '0ms'

  play = $wrapper.appendChild(newElement('button', undefined, {})) as HTMLButtonElement
  play.innerHTML = 'Play'

  pause = $wrapper.appendChild(newElement('button', undefined, {})) as HTMLButtonElement
  pause.innerHTML = 'Pause'

  reverse = $wrapper.appendChild(newElement('button', undefined, {})) as HTMLButtonElement
  reverse.innerHTML = 'Reverse'

  // update the current value when the slider is dragged
  scrubberControl.addEventListener('input', function (evt) {
    var value = +(evt.currentTarget as HTMLInputElement).value
    timeline.currentTime = value
    onValueChanged(value)
  })

  play.addEventListener('click', function () {
    if (timeline) {
      timeline.play()
    }
  })

  pause.addEventListener('click', function () {
    if (timeline) {
      timeline.pause()
    }
  })
  reverse.addEventListener('click', function () {
    timeline && timeline.reverse()
  })
  
  isInitialized = true
}

export function player(timeline2: ITimeline) {
  init();
  
  if (timeline) {
    timeline.off('update', updateScrubber)
  }

  scrubberControl.setAttribute('max', String(timeline2.duration))
  scrubberControl.value = String(timeline2.currentTime)
  timeline2.on('update', updateScrubber)
  timeline = timeline2
}
