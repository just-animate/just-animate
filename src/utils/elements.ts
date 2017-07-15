import { toArray } from './lists'

export function $(element: HTMLElement | HTMLDocument, selector: string) {
  return toArray(element.querySelectorAll(selector))
}

export function attr(element: HTMLElement, name: string, value: string) {
  element.setAttribute(name, value)
}

export function appendChild(element: HTMLElement, child: HTMLElement) {
  element.appendChild(child)
  return child
}
