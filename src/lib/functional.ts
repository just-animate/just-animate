import { _ } from './constants'

/**
 * Caches the results of functions
 * @param func A function to memoize
 */
export function memoize<T extends Function>(func: T): T {
  // note: consider using a normal object and parameter 1 instead of using a list of arguments
  const cache: { args: IArguments; value: T }[] = []

  return (function() {
    const args = arguments

    // find and return existing arguments
    for (var h = 0, hlen = cache.length; h < hlen; h++) {
      // note: it might be faster to do an .every(), should do a perf check on this
      var keys = cache[h].args

      if (keys.length !== hlen) {
        // the cheapest test for equality
        continue
      }

      var matches = 0
      var ilen = args.length
      for (var i = 0; i < ilen; i++) {
        if (keys[i] !== args[i]) {
          break
        }
        ++matches
      }
      if (matches === ilen) {
        return cache[h].value
      }
    }

    // add and return result if not in cache
    var value = func.apply(_, args)
    cache.push({ args, value })
    return value
  } as any) as T
}
