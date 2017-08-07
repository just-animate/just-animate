import { PropertyEffects } from '../lib/types';
import { includes } from '../lib/lists';
import { isNumber, isDefined } from '../lib/inspect';
import { cssLengths, PX } from './constants';

export function appendUnits(effects: PropertyEffects) {
  // suffix lengths
  for (var propName in effects) {
    if (includes(cssLengths, propName)) {
      var prop = effects[propName]
      for (var offset in prop) {
        var obj = prop[offset]
        if (isDefined(obj)) {
          var value = obj.value
          if (isNumber(value)) {
            obj.value += PX
          }
        }
      }
    }
  }
}
