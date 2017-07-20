import { PropertyEffects } from '../../types';
import { forEach, includes } from '../../utils/lists';
import { isNumber } from '../../utils/type';
import { cssLengths, PX } from './constants';

export function appendUnits(effects: PropertyEffects) {
  // suffix lengths
  for (const propName in effects) {
    const prop = effects[propName]
    forEach(prop, (value, i) => {
      if (includes(cssLengths, propName) && isNumber(value.value)) {
        prop[i].value += PX
      }
    })
  }
}
