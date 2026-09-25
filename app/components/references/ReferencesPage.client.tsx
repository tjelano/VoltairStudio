import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { ReferenceCard } from './ReferenceCard';
import { PromptBuilder } from './PromptBuilder';
import { SearchFilters } from './SearchFilters';
import { EMPTY_SEARCH_FILTERS, type InspoScreen, type InspoSearchResponse, type SearchFilterSelections } from './types';
import {
  listReferences,
  saveReference,
  removeReference,
  type SavedReference,
} from '~/lib/persistence/referencesDb.client';

export function ReferencesPage() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilterSelections>(EMPTY_SEARCH_FILTERS);
  const [results, setResults] = useState<InspoScreen[]>([]);
  const [searching, setSearching] = useState(false);
  const [saved, setSaved] = useState<SavedReference[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [importUrl, setImportUrl] = useState('');
  const [importing, setImporting] = useState(false);
  const searchSeq = useRef(0);

  const refreshSaved = async () => {
    setSaved(await listReferences());
  };

  useEffect(() => {
    refreshSaved();
  }, []);

  const runSearch = async () => {
    const seq = ++searchSeq.current;
    setSearching(true);

    try {
      const activeFilters = Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== ''));

      const response = await fetch('/api/references/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, ...activeFilters }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = (await response.json()) as InspoSearchResponse;

      if (seq === searchSeq.current) {
        setResults(data.results ?? []);
      }
    } catch (error) {
      if (seq === searchSeq.current) {
        toast.error('Search failed — is the dev server able to reach inspomcp.dev?');
      }

      console.error(error);
    } finally {
      if (seq === searchSeq.current) {
        setSearching(false);
      }
    }
  };

  const fetchFullScreen = async (slugOrUrl: string): Promise<InspoScreen> => {
    const response = await fetch('/api/references/screen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slugOrUrl }),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return (await response.json()) as InspoScreen;
  };

  const persistReference = async (screen: InspoScreen) => {
    const existing = saved.find((ref) => ref.id === screen.slug);
    await saveReference({
      id: screen.slug,
      slug: screen.slug,
      title: screen.title,
      siteUrl: screen.sourceUrl,
      screenshotUrl: screen.thumb,
      tags: screen.macrostructure ? [screen.macrostructure.label] : [],
      palette: screen.palette,
      northstar: screen.northstar,
      autopsy: screen.autopsy,
      note: existing?.note ?? '',
      savedAt: existing?.savedAt ?? Date.now(),
    });
    await refreshSaved();
    toast.success(`Saved "${screen.title}"`);
  };

  const handleSave = async (screen: InspoScreen) => {
    try {
      const full = await fetchFullScreen(screen.slug);
      await persistReference(full);
    } catch (error) {
      console.error(error);
      await persistReference(screen);
    }
  };

  const handleImport = async () => {
    if (!importUrl.trim()) {
      return;
    }

    setImporting(true);

    try {
      const full = await fetchFullScreen(importUrl);
      await persistReference(full);
      setImportUrl('');
    } catch (error) {
      toast.error("Couldn't find that site on Inspo — check the link and try again");
      console.error(error);
    } finally {
      setImporting(false);
    }
  };

  const handleRemove = async (id: string) => {
    await removeReference(id);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);

      return next;
    });
    await refreshSaved();
  };

  const handleNoteChange = async (ref: SavedReference, note: string) => {
    setSaved((prev) => prev.map((item) => (item.id === ref.id ? { ...item, note } : item)));

    try {
      await saveReference({ ...ref, note });
    } catch (error) {
      console.error(error);
      toast.error('Could not save note');
    }
  };

  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  const savedIds = new Set(saved.map((ref) => ref.id));

  const selected = saved.filter((ref) => selectedIds.has(ref.id));

  return (
    <div className="relative flex flex-col h-full overflow-y-auto z-1">
      <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col gap-8">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-bolt-elements-textPrimary mb-2">References</h1>
          <p className="text-bolt-elements-textSecondary">
            Search Inspo's archive of real production sites, save the ones you like, and build a grounded prompt to hand
            to VoltairStudio.
          </p>
        </div>

        <div className="rounded-xl border border-bolt-elements-borderColor bg-bolt-elements-background-depth-2 shadow-sm p-4 sm:p-6 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && runSearch()}
              placeholder="e.g. minimalist editorial agency portfolio"
              className="flex-1 p-2.5 rounded-lg border border-bolt-elements-borderColor bg-bolt-elements-background-depth-1 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
            />
            <SearchFilters selections={filters} onChange={setFilters} />
            <button
              onClick={runSearch}
              disabled={searching}
              className="px-5 py-2.5 rounded-lg bg-bolt-elements-button-primary-background text-bolt-elements-button-primary-text font-medium disabled:opacity-50 transition-opacity"
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs text-bolt-elements-textTertiary">
            <div className="h-px flex-1 bg-bolt-elements-borderColor" />
            or
            <div className="h-px flex-1 bg-bolt-elements-borderColor" />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              value={importUrl}
              onChange={(event) => setImportUrl(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && handleImport()}
              placeholder="Paste a link from inspomcp.dev to save it directly"
              className="flex-1 p-2.5 rounded-lg border border-bolt-elements-borderColor bg-bolt-elements-background-depth-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/50"
            />
            <button
              onClick={handleImport}
              disabled={importing}
              className="px-5 py-2.5 rounded-lg border border-bolt-elements-borderColor bg-bolt-elements-background-depth-3 text-sm font-medium disabled:opacity-50 transition-opacity"
            >
              {importing ? 'Importing...' : 'Import'}
            </button>
          </div>
        </div>

        {results.length > 0 && (
          <div>
            <h2 className="text-base font-semibold text-bolt-elements-textPrimary mb-3">Results</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((screen) => (
                <ReferenceCard
                  key={screen.slug}
                  screen={screen}
                  saved={savedIds.has(screen.slug)}
                  onSave={() => handleSave(screen)}
                  onRemove={() => handleRemove(screen.slug)}
                />
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-base font-semibold text-bolt-elements-textPrimary mb-3">
            Saved{saved.length > 0 ? ` (${saved.length})` : ''}
          </h2>
          {saved.length > 0 ? (
            <>
              <p className="text-sm text-bolt-elements-textSecondary mb-3">Select the ones to build a prompt from</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {saved.map((ref) => (
                  <ReferenceCard
                    key={ref.id}
                    screen={{
                      slug: ref.slug,
                      title: ref.title,
                      sourceUrl: ref.siteUrl ?? '',
                      thumb: ref.screenshotUrl ?? '',
                    }}
                    saved
                    onRemove={() => handleRemove(ref.id)}
                    note={ref.note}
                    onNoteChange={(note) => handleNoteChange(ref, note)}
                    selected={selectedIds.has(ref.id)}
                    onToggleSelect={() => toggleSelected(ref.id)}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-dashed border-bolt-elements-borderColor p-8 text-center text-sm text-bolt-elements-textSecondary">
              Nothing saved yet — search above and click Save on anything you like.
            </div>
          )}
        </div>

        <PromptBuilder selected={selected} />
      </div>
    </div>
  );
}
