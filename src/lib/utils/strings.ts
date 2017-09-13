import { isString } from './inspect'

const camelCaseRegex = /([a-z])[- ]([a-z])/gi

function camelCaseReplacer(_: string, p1: string, p2: string) {
  return p1 + p2.toUpperCase()
}

export function toCamelCase(value: string): string {
  return isString(value) ? (value as string).replace(camelCaseRegex, camelCaseReplacer) : ''
}

export function hyphenate(value: string): string {
  return value.replace(/([A-Z])/g, match => `-` + match[0].toLowerCase())
}

export function csvToList(data: string) {
  return data.split(',')
}
