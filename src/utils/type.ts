export function isDefined(a: any) {
  return !!a || a === 0 || a === false
}
export function getTypeString(val: any) {
  return Object.prototype.toString.call(val)
}
export function isFunction(a: any) {
  return typeof a === 'function'
}
export function isNumber(a: any) {
  return typeof a === 'number'
}
export function isObject(a: any) {
  return typeof a === 'object' && !!a
}
export function isString(a: any) {
  return typeof a === 'string'
}
export function isArrayLike(a: any) {
  return isDefined(a) && !isString(a) && !isFunction(a) && isNumber(a.length)
}
export function isSVG(target: SVGElement | any) {
  return target instanceof SVGAElement
}
export function isDOM(target: Node | any) {
  return target.nodeType || isSVG(target)
}
