import { isArrayLike, isObject, getTypeString } from './type'
import { _ } from './resources'

/**
 * Copies a single property from origin to destination
 */
export function deepCopyProperty(prop: string | number, origin: {}, dest: {}) {
  const originProp = origin[prop]
  let destProp = dest[prop]

  // if the source and target don't have the same type, replace with target
  const originType = getTypeString(originProp)
  const destType = getTypeString(destProp)

  if (originType !== destType) {
    destProp = _
  }

  if (isArrayLike(originProp)) {
    // note: a compromise until a solution for merging arrays becomes clear
    dest[prop] = originProp.slice(0)
  } else if (isObject(originProp)) {
    // tslint:disable-next-line:no-use-before-declare
    dest[prop] = deepCopyObject(originProp, destProp)
  } else {
    dest[prop] = originProp
  }
}

/**
 * performs a deep copy of properties from origin to destination
 */
export function deepCopyObject<T1 extends {}, T2 extends {}>(
  origin: T1,
  dest?: T2
): any {
  dest = dest || ({} as T2)
  for (let prop in origin) {
    deepCopyProperty(prop, origin, dest)
  }
  return dest
}
