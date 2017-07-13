import { isString } from './type'

const camelCaseRegex = /([a-z])[- ]([a-z])/gi
const camelCaseReplacer = (_: string, p1: string, p2: string) =>
  p1 + p2.toUpperCase()

export function toCamelCase(value: string): string {
  return isString(value)
    ? (value as string).replace(camelCaseRegex, camelCaseReplacer)
    : ''
}
