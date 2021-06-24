import { Inputs, useCallback, useEffect } from "preact/hooks";

export const useObserver = (
  root: HTMLElement | null,
  callback: IntersectionObserverCallback,
  inputs: Inputs): void => {

  const _callback = useCallback(callback, [callback]);
  useEffect(() => {
      const observer = new IntersectionObserver(_callback, {
        root: null,
        rootMargin: '0px',
        threshold: 0.9,
      });
      if (root) {
        Array.from(root.children).forEach(child => {
          observer.observe(child);
        });
      }
      return () => observer.disconnect();
  }, [root, _callback, inputs]);
};