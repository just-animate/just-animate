const now = performance && performance.now ? performance.now : Date.now

export { now }

/**
 * Wrapper for raf with fallback to setTimeout
 */
export function raf(ctx: any, fn: Function): any {
  const callback = () => fn(ctx)
  return requestAnimationFrame
    ? requestAnimationFrame(callback)
    : setTimeout(callback, 16)
}

export function lazy<T>(initializer: () => T) {
  let value: T
  return () => value || (value = initializer())
}
