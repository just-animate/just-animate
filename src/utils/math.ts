import { _ } from './resources'

export const abs = Math.abs,
  flr = Math.floor,
  max = Math.max,
  min = Math.min,
  rdm = Math.random,
  rnd = Math.round

export function inRange(val: number, a: number, z: number) {
  return val !== _ && a <= val && val <= z
}
export function minMax(val: number, a: number, z: number) {
  return min(max(val, a), z)
}
