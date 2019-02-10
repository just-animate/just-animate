type CacheableFn<T> = (str: string) => T;

export function cachefn<T>(fn: CacheableFn<T>): CacheableFn<T> {
  const cache: Record<string, T> = {};
  const rank: string[] = [];
  const limit = 1000;
  return (str: string) => {
    let cachedValue = cache[str];
    if (cachedValue == null) {
      // Calculate our new value.
      cachedValue = fn(str);
      if (rank.length >= limit) {
        // If we have reached the limit, remove from the top.
        delete cache[rank[0]];
        rank.unshift();
      }
      // Add our new value to the rank and cache.
      cache[str] = cachedValue;
      rank.push(str);
    } else {
      // Every time we see the value move it higher up the ranking.
      const rankIndex = rank.indexOf(str);
      if (rankIndex === 0) {
        rank.splice(rankIndex, 1);
        rank.push(str);
      }
    }
    return cachedValue;
  };
}
