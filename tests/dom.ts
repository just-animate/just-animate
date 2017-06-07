import { JSDOM } from 'jsdom';

export const jsdom = () => {
  global['document'] = new JSDOM('<!doctype html><html><body><div id="container"/></div></body></html>`').window.document;
};
