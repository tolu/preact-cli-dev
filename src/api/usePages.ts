import { useEffect, useState } from "preact/hooks";
import { getLogger } from "../modules/logger";
import { useJson } from "./utils";

export interface Page {
  readonly link: string; // "https://contentlayout.test.rikstv.no/1/pages/33a1964f-f6f0-46c5-b8d4-f22d97259321"
  readonly name: string; // "Start"
  readonly slug: string; // "start"
  // readonly order: number; // 0
  // readonly id: string; //"33a1964f-f6f0-46c5-b8d4-f22d97259321"
}

const log = getLogger('pages');
const defaultState = (): Page[] | null => JSON.parse(sessionStorage.getItem('app.pages') || 'null');

export const usePages = (): { pages: Page[] | undefined, error: string | undefined } => {
  const [pages, setPages] = useState( defaultState() ?? undefined );
  log.debug('usePages', { cached: pages });
  const { data, error } = useJson<Page[]>('https://contentlayout.test.rikstv.no/1/pages', () => pages);
  useEffect(() => {
    if (data) {
      const mappedData = data.map(d => ({link: d.link,name: d.name,slug: d.slug}));
      setPages(mappedData);
      sessionStorage.setItem('app.pages', JSON.stringify(mappedData));
    }
  }, [data]);

  return { pages, error };
}
