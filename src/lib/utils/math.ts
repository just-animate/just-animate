import { _ } from './constants'

export const abs = Math.abs
export const flr = Math.floor
export const max = Math.max
export const min = Math.min
export const rdm = Math.random
export const rnd = Math.round

export function inRange(val: number, a: number, z: number) {
  return val !== _ && a <= val && val <= z
}
export function inBetween(val: number, a: number, z: number, sign: number) {
  return sign > 0 ? inRange(val, a, z) : inRange(val, z, a)
}
export function minMax(val: number, a: number, z: number) {
  return min(max(val, a), z)
}
