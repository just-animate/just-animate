import { inOut } from "./inOut";
import { ja } from "../types";

export function power(type?: ja.EaseTypes, c?: number) {
  // Ensure it is actually a number.
  c = +(c || c === 0 ? c : 2);
  return inOut((o: number) => Math.pow(o, c!), type);
}
