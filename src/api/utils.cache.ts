import { useCallback, useEffect, useState } from "preact/hooks";
import { getLogger } from "../modules/logger";
import localforage from 'localforage';

type Item<T> = { value?: T };
const log = getLogger('cache');

// TODO: replace localStorage/sessionStorage with localforage and set actual TTL

export const useCachedState = <T>(key: string): [T|undefined, (value: T) => void] => {
  const [cacheValue, setCacheValue] = useState<Item<T>>({});

  useEffect(() => {
    (async () => {
      const data = await localforage.getItem<Item<T>>(key);
      data && setCacheValue(data);
    })();
  }, [key]);
  
  const setCacheValueExternal = useCallback(async (value: T) => {
    if (cacheValue.value === value) return;
    
    log.debug('update cached value', {key, value});
    await localforage.setItem(key, { value });
    setCacheValue({ value });
  }, [setCacheValue, cacheValue, key]);

  return [cacheValue.value, setCacheValueExternal];
}
