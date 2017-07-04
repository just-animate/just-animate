import * as types from '../types'
import { lengthProps } from './resources';
import { isNumber } from '../utils'

export const lengthHandler: types.PropertyHandler = {
  isHandled(name: string) {
    return lengthProps.indexOf(name) !== -1
  },
  toName(name: string) {
    return name
  },
  toValue(_name: string, value: number | string) {
    return isNumber(value) ? value + 'px' : value as string
  },
  combine(values: string[]) {
    return values
  }
}
