export const isDefined = (a: any) => !!a || a === 0 || a === false
export const getTypeString = (val: any) => Object.prototype.toString.call(val)
export const isFunction = (a: any) => typeof a === 'function'
export const isNumber = (a: any) => typeof a === 'number'
export const isObject = (a: any) => typeof a === 'object' && !!a
export const isString = (a: any) => typeof a === 'string'
export function isArrayLike(a: any) {
  return isDefined(a) && !isString(a) && !isFunction(a) && isNumber(a.length)
}
export const isSVG = (target: SVGElement | any) => target instanceof SVGAElement
export const isDOM = (target: Node | any) => target.nodeType || isSVG(target)
