export function find(identifier: string) {
  return document.getElementById(identifier) as HTMLElement
}

export function on(element: Element, event: string, listener: any) {
  element.addEventListener(event, listener)
}
