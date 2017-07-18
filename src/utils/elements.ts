export function $(element: HTMLElement | HTMLDocument, selector: string) {
  return Array.prototype.slice.call(element.querySelectorAll(selector))
}

export function attr(element: HTMLElement, name: string, value: string) {
  element.setAttribute(name, value)
}

export function appendChild(element: HTMLElement, child: HTMLElement) {
  return element.appendChild(child)
}
