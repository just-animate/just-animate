export function now() {
  return (performance && performance.now()) || Date.now()
}

/**
 * Wrapper for raf with fallback to setTimeout
 */
export function raf(fn: FrameRequestCallback): number {
  return requestAnimationFrame(fn)
}

export function caf(handle: number) {
  cancelAnimationFrame(handle)
}

export function lazy<T>(initializer: () => T) {
  let value: T
  return () => value || (value = initializer())
}
