import { ja } from "../types";

export function getValueFromCache(
  target: ja.AnimationTarget,
  propName: string
): ja.AnimationValue | undefined {
  if (target["__ja"]) {
    return target["__ja"][propName];
  }
}

export function putValueInCache(
  target: ja.AnimationTarget,
  propName: string,
  value: ja.AnimationValue
) {
  if (!target["__ja"]) {
    target["__ja"] = {};
  }
  target["__ja"][propName] = value;
}
