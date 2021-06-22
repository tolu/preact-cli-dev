import { useCallback, useState } from "preact/hooks";
import { getLogger } from "../modules/logger";

type Item<T> = { value?: T };
const log = getLogger('cache');

// TODO: replace localStorage/sessionStorage with localforage and set actual TTL

export const useCachedState = <T>(key: string, storage: Storage): [T|undefined, (value: T) => void] => {
  const [cacheValue, setCacheValue] = useState<Item<T>>(JSON.parse(storage.getItem(key) ?? '{}'));
  
  const setCacheValueExternal = useCallback((value: T) => {
    if (cacheValue.value === value) return;
    
    log.debug('update cached value', {key, value});
    storage.setItem(key, JSON.stringify({ value }));
    setCacheValue({ value });
  }, [setCacheValue, cacheValue, key, storage]);

  return [cacheValue.value, setCacheValueExternal];
}
