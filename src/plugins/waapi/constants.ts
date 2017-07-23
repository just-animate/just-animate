export const TOLERANCE = 0.0001
export const RUNNING = 'running'

export const PX = 'px'
export const DEG = 'deg' 

export const X = 'X'
export const Y = 'Y'
export const Z = 'Z'

export const TRANSLATE = 'translate'
export const TRANSFORM = 'transform'

export const transformAngles = [
  'rotateX',
  'rotateY',
  'rotateZ',
  'rotate'
]
export const transformScales = [
  'scaleX',
  'scaleY',
  'scaleZ',
  'scale'
]
export const transformLengths = [
  'perspective',
  'x',
  'y',
  'z'
]
export const transforms = [TRANSFORM].concat(transformAngles, transformScales, transformLengths)

export const aliases = {
  x: TRANSLATE + X,
  y: TRANSLATE + Y,
  z: TRANSLATE + Z
}

// animatable length properties
export const cssLengths = [
  'backgroundSize',
  'border',
  'borderBottom',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',
  'borderBottomWidth',
  'borderLeft',
  'borderLeftWidth',
  'borderRadius',
  'borderRight',
  'borderRightWidth',
  'borderTop',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderTopWidth',
  'borderWidth',
  'bottom',
  'columnGap',
  'columnRuleWidth',
  'columnWidth',
  'columns',
  'flexBasis',
  'font',
  'fontSize',
  'gridColumnGap',
  'gridGap',
  'gridRowGap',
  'height',
  'left',
  'letterSpacing',
  'lineHeight',
  'margin',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'marginTop',
  'maskSize',
  'maxHeight',
  'maxWidth',
  'minHeight',
  'minWidth',
  'outline',
  'outlineOffset',
  'outlineWidth',
  'padding',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'perspective',
  'right',
  'shapeMargin',
  'tabSize',
  'top',
  'width',
  'wordSpacing'
]

export const cssOtherProps = [
  'all',
  'backdropFilter',
  'background',
  'backgroundColor',
  'backgroundPosition',
  'borderBottomColor',
  'borderColor',
  'borderLeftColor',
  'borderRightColor',
  'borderTopColor',
  'boxShadow',
  'caretColor',
  'clip',
  'clipPath',
  'color',
  'columnCount',
  'columnRule',
  'columnRuleColor',
  'filter',
  'flex',
  'flexGrow',
  'flexShrink',
  'fontSizeAdjust',
  'fontStretch',
  'fontVariationSettings',
  'fontWeight',
  'mask',
  'maskPosition',
  'objectPosition',
  'offset',
  'offsetAnchor',
  'offsetDistance',
  'offsetPath',
  'offsetPosition',
  'offsetRotate',
  'opacity',
  'order',
  'outlineColor',
  'perspectiveOrigin',
  'scrollSnapCoordinate',
  'scrollSnapDestination',
  'shapeImageThreshold',
  'shapeOutside',
  'textDecoration',
  'textDecorationColor',
  'textEmphasis',
  'textEmphasisColor',
  'textIndent',
  'textShadow',
  'transformOrigin',
  'verticalAlign',
  'visibility',
  'zIndex'
]

export const cssProps = transforms.concat(cssLengths, cssOtherProps)
