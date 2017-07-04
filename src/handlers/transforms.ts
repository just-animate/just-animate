import * as types from '../types'
import { transformProps, transformAliases } from './resources';

export const transformHandler: types.PropertyHandler = {
  isHandled(name: string) {
    return transformProps.indexOf(name) !== -1
  },
  toName(_name: string) {
    return 'transform'
  },
  toValue(name: string, value: number | number) {
    return `${(transformAliases[name] || name)}(${value})`
  },
  combine(values: string[]) {
    return [ values.join(' ') ]
  }
}
