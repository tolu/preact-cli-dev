import { useCallback, useState } from "preact/hooks";
import { getLogger } from "../modules/logger";
import localforage from 'localforage';

type Item<T> = { value?: T, exp?: number };
const log = getLogger('cache');

export const useCachedState = <T>(key: string, ttlSeconds: number): [() => Promise<T|undefined>, (value: T) => void] => {
  const [cacheValue, setCacheValue] = useState<Item<T>>({});

  const getCachedValue = useCallback(async () => {
    if (ttlSeconds === 0) {
      return undefined;
    }
    if (cacheValue.value) {
      return cacheValue.value;
    }
    const data = await localforage.getItem<Item<T>>(key);
    if (data && (data.exp || 0) > Date.now()) {
      setCacheValue(data);
      return data.value;
    }
    return undefined;
  }, [cacheValue.value, key, ttlSeconds]);
  
  const setCacheValueExternal = useCallback(async (value: T) => {
    if (cacheValue.value === value) return;
    
    log.debug('update cached value', {key, value});
    await localforage.setItem<Item<T>>(key, { value, exp: Date.now() + ttlSeconds*1000 });
    setCacheValue({ value });
  }, [setCacheValue, cacheValue, key, ttlSeconds]);

  return [getCachedValue, setCacheValueExternal];
}
