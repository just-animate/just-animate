import { JSDOM } from 'jsdom'

export const jsdom = () => {
  // tslint:disable-next-line:no-string-literal
  global['document'] = new JSDOM('<!doctype html><html><body><div id="container"/></div></body></html>`').window.document
}
