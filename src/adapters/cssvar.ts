import { ja } from "../types";

export function readCssVar(target: HTMLElement, key: string) {
  return target.style.getPropertyValue(key);
}

export function writeCssVar(
  target: HTMLElement,
  key: string,
  value: ja.AnimationTarget
) {
  target.style.setProperty(key, value.toString());
}
