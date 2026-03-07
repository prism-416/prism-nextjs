import mimicFunction from "mimic-function";

type CacheItem<T> = {
  data: T;
  maxAge: number;
};

type CacheMap<TKey, TValue> = Map<TKey, CacheItem<TValue>>;

type CacheKeyFn<TArgs extends unknown[], TKey> = (...args: TArgs) => TKey;

type MemoizeOptions<TArgs extends unknown[], TResult, TKey> = {
  cacheKey?: CacheKeyFn<TArgs, TKey>;
  cache?: CacheMap<TKey, TResult>;
  maxAge?: number;
};

/**
 * @description 메모이즈 함수 (동시 요청 방지)
 * @param fn
 * @param cacheKey
 * @param cache
 * @param maxAge
 */
export function memoize<T>(
  fn: (this: unknown, ...args: unknown[]) => T,
  { cacheKey, cache = new Map<unknown, CacheItem<T>>(), maxAge }: MemoizeOptions<unknown[], T, unknown> = {},
): (this: unknown, ...args: unknown[]) => T {
  if (maxAge === 0) {
    return fn;
  }
  if (typeof maxAge === "number") {
    const maxSetIntervalValue = 2147483647;
    if (maxAge > maxSetIntervalValue) {
      throw new TypeError(`The \`maxAge\` option cannot exceed ${maxSetIntervalValue}.`);
    }
    if (maxAge < 0) {
      throw new TypeError("The `maxAge` option should not be a negative number.");
    }
  }

  function memoized(this: unknown, ...args: unknown[]) {
    const key = cacheKey ? cacheKey(...args) : args[0];
    const cacheItem = cache.get(key);
    if (cacheItem && (!maxAge || Date.now() < cacheItem.maxAge)) {
      return cacheItem.data;
    }

    const result = fn.apply(this, args);
    cache.set(key, { data: result, maxAge: maxAge ? Date.now() + maxAge : Number.POSITIVE_INFINITY });

    if (typeof maxAge === "number" && maxAge !== Number.POSITIVE_INFINITY) {
      const timer = setTimeout(() => {
        cache.delete(key);
      }, maxAge);
      timer.unref?.();
    }

    return result;
  }

  // 함수를 래핑하고 원래 이름과 기타 속성을 유지하려는 경우 유용.
  mimicFunction(memoized, fn, { ignoreNonConfigurable: true });

  return memoized;
}
