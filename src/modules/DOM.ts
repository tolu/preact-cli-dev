import { isSSR } from "./isSSR";

/* Use DOM globals from here to get SSR to work */

class SsrStorage {
    readonly length: number = 0;
    clear() { return; }
    getItem(key: string) { return null; }
    key(index: number) { return null; }
    removeItem(key: string) { return; }
    setItem(key: string, value: string) { return; }
}
const ssrStorage = new SsrStorage();

export const DOM = {
  sessionStorage: isSSR ? ssrStorage : window.sessionStorage,
  localStorage: isSSR ? ssrStorage : window.localStorage,
  location: {
    origin: isSSR ? 'http://ssr' : window.location.origin,
    pathname: isSSR ? '/' : window.location.pathname,
  },
  dispatchEvent: isSSR ? (event: Event) => false : window.dispatchEvent.bind(window),
  addEventListener: isSSR ? (ev: string, options: any) => false : window.addEventListener.bind(window),
  removeEventListener: isSSR ? (ev: string, listener: any) => false : window.removeEventListener.bind(window),
}

