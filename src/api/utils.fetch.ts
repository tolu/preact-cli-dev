import { useEffect, useState } from "preact/hooks";
import { sessionId, deviceId } from "../modules/uuid";
import { getLogger } from "../modules/logger";
import { useCachedState } from "./utils.cache";

const log = getLogger('cache');

export const useJson = <T>(url: string, ttlSeconds = 0): { data: T | undefined, error: string | undefined } => {
  const [getCachedData, setCachedData] = useCachedState<T>(url, ttlSeconds);
  const [data, setData] = useState<T|undefined>( undefined );
  const [error, setError] = useState<string|undefined>( undefined );

  useEffect(() => {
    if (!url) return;
    if (data) return;

    const controller = new AbortController();
    const signal = controller.signal;

    (async () => {
      const cachedValue = await getCachedData();
      if (cachedValue) {
        setData(cachedValue);
      } else {
        fetch(url, {
          signal,
          headers: {
            accept: "application/json",
            "x-rikstv-appinstallationid": deviceId,
            "x-rikstv-application": "RiksTV-Browser/4.0.590",
            "x-rikstv-appsessionid": sessionId
          },
        })
        .then((r) => {
          if (r.ok && r.status < 400) {
            return r.json() as Promise<T>;
          }
          setError(`GET: ${url} (${r.status})`);
          return undefined;
        })
        .then(data => {
          if (data) {
            setData(data);
            setCachedData(data);
          } else {
            log.error(`Something went wrong when fetching ${url}`);
          }
        })
        .catch((err) => setError(err.message));
      }
    })()

    return () => controller.abort();
  }, [url, data, getCachedData, setCachedData]);

  return { data, error };
}