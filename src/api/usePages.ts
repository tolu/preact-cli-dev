import { useEffect } from "preact/hooks";
import { DOM } from "../modules/DOM";
import { useCachedState } from "./utils.cache";
import { useJson } from "./utils.fetch";

export interface PageBase {
  readonly link: string; // "https://contentlayout.test.rikstv.no/1/pages/33a1964f-f6f0-46c5-b8d4-f22d97259321"
  readonly name: string; // "Start"
  readonly slug: string; // "start"
  // readonly order: number; // 0
  // readonly id: string; //"33a1964f-f6f0-46c5-b8d4-f22d97259321"
}

export const usePages = (): { pages: PageBase[] | undefined, error: string | undefined } => {

  const [pages, setPages] = useCachedState<PageBase[]>('app.pages', DOM.sessionStorage);

  const { data, error } = useJson<PageBase[]>('https://contentlayout.test.rikstv.no/1/pages', () => pages);
  useEffect(() => {
    if (data) {
      setPages(data);
    }
  }, [data, setPages]);

  return { pages, error };
}
