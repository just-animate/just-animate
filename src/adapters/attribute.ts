import { ja } from "../types";

export function readAttribute(target: HTMLElement, key: string) {
  return target.getAttribute(key) || "";
}

export function writeAttribute(
  target: HTMLElement,
  key: string,
  value: ja.AnimationTarget
) {
  target.setAttribute(key, value.toString());
}
