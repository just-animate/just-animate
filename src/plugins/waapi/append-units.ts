import { PropertyEffects } from '../../types';
import { forEach, includes } from '../../utils/lists';
import { isNumber } from '../../utils/type';
import { cssLengths, PX } from './constants';

export function appendUnits(effects: PropertyEffects) {
  // suffix lengths
  for (var propName in effects) {
    var prop = effects[propName]
    forEach(prop, (value, i) => {
      if (includes(cssLengths, propName) && isNumber(value.value)) {
        prop[i].value += PX
      }
    })
  }
}
