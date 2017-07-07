import * as types from '../types'
import { transformProps, transformAliases } from './resources';
import { TRANSFORM } from '../utils';

export const transformHandler: types.PropertyHandler = {
  convert(prop: { name: string, value: string | number }) {
    if (transformProps.indexOf(prop.name) !== -1) {
      prop.value = `${(transformAliases[prop.name] || prop.name)}(${prop.value})`
      prop.name = TRANSFORM     
    }
  },
  merge(name: string, values: string[]) {
    if (name === TRANSFORM) {
      values.splice(0, values.length, values.join(' '))
    }
  }
}
