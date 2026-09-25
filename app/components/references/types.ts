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
