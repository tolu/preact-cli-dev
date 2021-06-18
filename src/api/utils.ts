import { useEffect, useState } from "preact/hooks";
import { sessionId, deviceId } from "../modules/uuid";

export const useJson = <T>(url: string, getFromCache?: () => T|undefined): { data: T | undefined, error: string | undefined } => {
  const [data, setData] = useState<T|undefined>( getFromCache?.() ?? undefined );
  const [error, setError] = useState<string|undefined>( undefined );

  useEffect(() => {
    if (data) return;

    const controller = new AbortController();
    const signal = controller.signal;
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
    .then(data => data && setData(data) )
    .catch((err) => setError(err.message));

    return () => controller.abort();
  }, [url, data]);

  return { data, error };
}
