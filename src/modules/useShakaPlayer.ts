import { useEffect, useState } from "preact/hooks";

declare global {
  interface Window {
    shaka: ShakaPlayer;
  }
}
type ShakaPlayer = any;

export const useShakaPlayer = (): ShakaPlayer | undefined => {
  const [player, setPlayer] = useState(window.shaka);
  useEffect(() => {
    // load if theres no global and scrip is not added to page
    if (!player && !document.querySelector('[src$="shaka-player.compiled.js"]')) {
      const s = document.createElement('script');
      s.src = '//unpkg.com/shaka-player/dist/shaka-player.compiled.js';
      s.onload = () => setPlayer(window.shaka);
      document.head.appendChild(s);
    }
  }, [player]);
  return player;
}