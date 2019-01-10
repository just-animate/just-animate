import { render } from "../render";

render.push({
  handle(target, key) {
    return target instanceof HTMLElement;
  },
  mix(left, right) {
    throw new Error("not implemented");
  },
  read(target: Element, key) {
    return getComputedStyle(target)[key];
  },
  render(target: HTMLElement, key, value) {
    target.style[key] = value;
  }
});
