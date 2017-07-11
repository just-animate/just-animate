import * as types from '../types'
import { includes, isNumber } from '../utils'

// animatable length properties
export const lengthProps = [
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

export const unitHandler = (_target: types.TargetConfiguration, effects: types.PropertyEffects) => {
    for (const propName in effects) {
      const keyframes = effects[propName] 
      const value = keyframes[propName]
      if (includes(lengthProps, propName) && isNumber(value)) {
        keyframes[propName] = value + 'px'
      }
    }
}
