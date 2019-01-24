import { ja } from "../types";

export function readStyle(target: HTMLElement, key: string) {
  return getComputedStyle(target)[key];
}
export function writeStyle(
  target: HTMLElement,
  key: string,
  value: ja.AnimationTarget
) {
  target.style[key] = value;
}
