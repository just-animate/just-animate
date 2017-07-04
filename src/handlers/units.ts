import * as types from '../types'
import { lengthProps, angleProps } from './resources';
import { isNumber } from '../utils'

export const unitHandler: types.PropertyHandler = {
  convert(prop: { name: string, value: number | string }) {
    if (lengthProps.indexOf(prop.name) !== -1 && isNumber(prop.value)) {
      prop.value = prop.value + 'px'
    } else if (angleProps.indexOf(prop.name) !== -1 && isNumber(prop.value)) {
       prop.value = prop.value + 'deg'
    }
  }
}
