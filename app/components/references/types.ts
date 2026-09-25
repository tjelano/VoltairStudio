export interface InspoScreen {
  slug: string;
  title: string;
  sourceUrl: string;
  thumb: string;
  mobile?: string;
  northstar?: string;
  autopsy?: string;
  palette?: string[];
  fonts?: string[];
  mode?: string;
  axes?: string | { paperBand?: string; displayClass?: string; accentHue?: string };
  macrostructure?: { slug: string; label: string };
}

export interface InspoSearchResponse {
  count: number;
  results: InspoScreen[];
}

export interface InspoFilters {
  style: string[];
  industry: string[];
  vibe: string[];
  color: string[];
  pageType: string[];
}

export interface SearchFilterSelections {
  style: string;
  industry: string;
  vibe: string;
  color: string;
  pageType: string;
}

export const EMPTY_SEARCH_FILTERS: SearchFilterSelections = {
  style: '',
  industry: '',
  vibe: '',
  color: '',
  pageType: '',
};
