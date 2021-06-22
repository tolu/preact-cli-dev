import { PageBase } from "./usePages";
import { useJson } from "./utils.fetch";

export interface Page extends PageBase {
  readonly swimlanes: SwimlaneBase[]
}
export interface SwimlaneBase {
  id: string; //  "83782338-4eee-4084-93fe-96de9fac7831",
  name: string; //  "I søkelyset",
  type: 'Default' | 'OnTvNow' | 'Menu';
  style: 'Hero' | 'Live' | 'Featured' | 'Standard' | 'MenuText';
  link: string; //  "https://contentsearch.test.rikstv.no/1/assets/lookup?[0].sid=333462&[1].sid=499150&[2].sid=HBON-ABINR&[3].sid=1478&[4].sid=HBON-AAEML&[5].sid=1376989",
  supportsPaging: boolean; //  false,
  lastUpdatedUtc: string; //  "2021-06-19T00:30:00Z"
}

export const usePage = (url: string): { page: Page | undefined, error: string | undefined } => {

  const { data, error } = useJson<Page>(url, 5 * 10);

  return { page: data, error };
}
