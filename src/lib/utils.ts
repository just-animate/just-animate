export function now() {
  return (performance && performance.now()) || Date.now()
}

/**
 * Wrapper for raf with fallback to setTimeout
 */
export function raf(fn: FrameRequestCallback) {
  return requestAnimationFrame(fn)
}

export function caf(handle: number) {
  cancelAnimationFrame(handle)
}

export function lazy<T>(initializer: () => T) {
  let value: T
  return () => value || (value = initializer())
}

export function assign<T1>(...objs: T1[]): T1
export function assign() {
  var args = arguments
  var result = {}
  for (var i = 0, ilen = args.length; i < ilen; i++) {
    var obj = args[i]
    if (obj) {
      for (var name in obj) {
        if (obj.hasOwnProperty(name)) {
          result[name] = obj[name]
        }
      }
    }
  }
  return result
}
