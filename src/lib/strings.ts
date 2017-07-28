import { isString } from './inspect'

const camelCaseRegex = /([a-z])[- ]([a-z])/gi

function camelCaseReplacer(_: string, p1: string, p2: string) {
  return p1 + p2.toUpperCase()
}

export function toCamelCase(value: string): string {
  return isString(value) ? (value as string).replace(camelCaseRegex, camelCaseReplacer) : ''
}

export function csvToList(data: string) {
  return data.split(',')
}
