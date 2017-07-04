import * as types from '../types'
import { angleProps } from './resources';
import { isNumber } from '../utils'

export const angleHandler: types.PropertyHandler = {
  isHandled(name: string) {
    return angleProps.indexOf(name) !== -1
  },
  toName(name: string) {
    return name
  },
  toValue(_name: string, value: number | string) {
    return isNumber(value) ? value + 'deg' : value as string
  },
  combine(values: string[]) {
    return values
  }
}
