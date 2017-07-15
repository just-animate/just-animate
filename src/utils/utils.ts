export const now = (performance && performance.now) || Date.now

/**
 * Wrapper for raf with fallback to setTimeout
 */
export function raf(ctx: any, fn: Function): number {
  return requestAnimationFrame(() => fn(ctx))
}

export function caf(handle: number) {
  cancelAnimationFrame(handle)
}

export function lazy<T>(initializer: () => T) {
  let value: T
  return () => value || (value = initializer())
}
