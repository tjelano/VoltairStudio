import { useEffect, useState } from 'react';
import { Dropdown, DropdownItem, DropdownRadioItem, DropdownSeparator } from '~/components/ui/Dropdown';
import { EMPTY_SEARCH_FILTERS, type InspoFilters, type SearchFilterSelections } from './types';

const FILTER_GROUPS: { key: keyof SearchFilterSelections; label: string }[] = [
  { key: 'style', label: 'Style' },
  { key: 'industry', label: 'Industry' },
  { key: 'vibe', label: 'Vibe' },
  { key: 'color', label: 'Color' },
  { key: 'pageType', label: 'Page Type' },
];

const KNOWN_ACRONYMS: Record<string, string> = { ai: 'AI', saas: 'SaaS' };

function formatLabel(value: string): string {
  return value
    .split('-')
    .map((word) => KNOWN_ACRONYMS[word] ?? word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const FILTER_KEYS: (keyof InspoFilters)[] = ['style', 'industry', 'vibe', 'color', 'pageType'];

function isValidInspoFilters(data: unknown): data is InspoFilters {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const record = data as Record<string, unknown>;

  return FILTER_KEYS.every((key) => {
    const value = record[key];
    return Array.isArray(value) && value.every((item: unknown) => typeof item === 'string');
  });
}

interface SearchFiltersProps {
  selections: SearchFilterSelections;
  onChange: (selections: SearchFilterSelections) => void;
}

export function SearchFilters({ selections, onChange }: SearchFiltersProps) {
  const [filters, setFilters] = useState<InspoFilters | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFailed(false);

    fetch('/api/references/filters')
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error(response.statusText))))
      .then((data: unknown) => {
        if (cancelled) {
          return;
        }

        if (isValidInspoFilters(data)) {
          setFilters(data);
        } else {
          setFailed(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFailed(true);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  const totalSelected = Object.values(selections).filter(Boolean).length;

  const setValue = (key: keyof SearchFilterSelections, value: string) => {
    onChange({ ...selections, [key]: selections[key] === value ? '' : value });
  };

  return (
    <Dropdown
      align="start"
      trigger={
        <button
          type="button"
          className="px-4 py-2.5 rounded-lg border border-bolt-elements-borderColor bg-bolt-elements-background-depth-1 text-sm font-medium transition-opacity hover:opacity-80"
        >
          Filters{totalSelected > 0 ? ` (${totalSelected})` : ''}
        </button>
      }
    >
      <div className="max-h-[70vh] overflow-y-auto w-72">
        {loading && !filters && (
          <div className="px-3 py-2 text-sm text-bolt-elements-textTertiary">Loading filters...</div>
        )}
        {failed && !loading && !filters && (
          <div className="px-3 py-2 flex flex-col gap-2">
            <div className="text-sm text-bolt-elements-textSecondary">Couldn't load filters.</div>
            <DropdownItem
              onSelect={() => setRetryCount((count) => count + 1)}
              className="justify-center text-accent-500"
            >
              Retry
            </DropdownItem>
          </div>
        )}
        {filters &&
          FILTER_GROUPS.map((group, index) => (
            <div key={group.key}>
              {index > 0 && <DropdownSeparator />}
              <div className="px-3 py-1.5 text-xs font-semibold text-bolt-elements-textTertiary uppercase tracking-wide">
                {group.label}
              </div>
              <div role="radiogroup" aria-label={group.label} className="flex flex-wrap gap-1.5 px-3 pb-2">
                {filters[group.key].map((value) => (
                  <DropdownRadioItem
                    key={value}
                    checked={selections[group.key] === value}
                    onSelect={() => setValue(group.key, value)}
                  >
                    {formatLabel(value)}
                  </DropdownRadioItem>
                ))}
              </div>
            </div>
          ))}
        {filters && (
          <>
            <DropdownSeparator />
            {totalSelected > 0 && (
              <DropdownItem
                onSelect={() => onChange(EMPTY_SEARCH_FILTERS)}
                className="justify-center text-bolt-elements-textSecondary"
              >
                Clear filters
              </DropdownItem>
            )}
            <DropdownItem className="justify-center font-medium text-accent-500">Done</DropdownItem>
          </>
        )}
      </div>
    </Dropdown>
  );
}
