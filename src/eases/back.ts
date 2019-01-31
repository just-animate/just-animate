import { ja } from "../types";
import { inOut } from "./inOut";

const factor = 1.70158;

export function back(type?: ja.EaseTypes) {
  return inOut(n => n * n * ((factor + 1) * n - factor), type);
}
