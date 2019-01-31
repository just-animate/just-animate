import { ja } from "../types";

export function steps(count: number, type?: string): ja.Ease {
  const fn = type === "end" ? Math.floor : Math.ceil;
  return (x: number) => {
    const n = fn(x * +count) / +count;
    return n < 0 ? 0 : n > 1 ? 1 : n;
  };
}
