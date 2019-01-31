import { ja } from "../types";
import { inOut } from "./inOut";

export function sine(type?: ja.EaseTypes) {
  return inOut((o: number) => -Math.cos((o * Math.PI) / 2) + 1, type);
}
