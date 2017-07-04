export const angleProps = [
    'rotateX',
    'rotateY',
    'rotateZ',
    'rotate',
    'rotate3d'
]

const transformUnitlessProps = [
    'matrix',    
    'scaleX',
    'scaleY',
    'scaleZ',
    'scale',
    'scale3d',
    'skew',
    'skewX',
    'skewY'
]

export const transformLengthProps = [
    'perspective',
    'translateX',
    'translateY',
    'translateZ',
    'translate',
    'translate3d',
    'x',
    'y',
    'z'
]

export const cssLengthProps = [
  'background-size',
  'border',
  'border-bottom',
  'border-bottom-left-radius',
  'border-bottom-right-radius',
  'border-bottom-width',
  'border-left',
  'border-left-width',
  'border-radius',
  'border-right',
  'border-right-width',
  'border-top',
  'border-top-left-radius',
  'border-top-right-radius',
  'border-top-width',
  'border-width',
  'bottom',
  'column-gap',
  'column-rule-width',
  'column-width',
  'columns',
  'flex-basis',
  'font',
  'font-size',
  'grid-column-gap',
  'grid-gap',
  'grid-row-gap',
  'height',
  'left',
  'letter-spacing',
  'line-height',
  'margin',
  'margin-bottom',
  'margin-left',
  'margin-right',
  'margin-top',
  'mask-size',
  'max-height',
  'max-width',
  'min-height',
  'min-width',
  'outline',
  'outline-offset',
  'outline-width',
  'padding',
  'padding-bottom',
  'padding-left',
  'padding-right',
  'padding-top',
  'perspective',
  'right',
  'shape-margin',
  'tab-size',
  'top',
  'width',
  'word-spacing'
]

export const transformAliases = {
    x: 'translateX',
    y: 'translateY',
    z: 'translateZ'
}

export const transformProps = angleProps.concat(transformUnitlessProps, transformLengthProps)
export const lengthProps = cssLengthProps.concat(transformLengthProps)
