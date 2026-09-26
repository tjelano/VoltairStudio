import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import {
  Dropdown,
  DropdownItem,
  DropdownCheckboxItem,
  DropdownRadioItem,
  DropdownSeparator,
} from '~/components/ui/Dropdown';
import { classNames } from '~/utils/classNames';
import { usePersistedState } from '~/lib/hooks/usePersistedState';
import { supabaseConnection } from '~/lib/stores/supabase';
import { firebaseConnection, initializeFirebaseConnection } from '~/lib/stores/firebase';
import { githubConnection } from '~/lib/stores/github';
import { vercelConnection } from '~/lib/stores/vercel';
import { netlifyConnection } from '~/lib/stores/netlify';

export interface SetupSelections {
  framework: string;
  connections: string[];
  features: string[];
}

export const EMPTY_SETUP_SELECTIONS: SetupSelections = { framework: '', connections: [], features: [] };

const FRAMEWORK_OPTIONS = ['React', 'Next.js', 'Vue', 'Plain HTML/CSS/JS'];

const CONNECTION_ITEMS = ['Supabase', 'Firebase', 'GitHub', 'Vercel', 'Netlify'];

const FEATURE_GROUPS: { label: string; items: string[] }[] = [
  {
    label: 'Analytics & SEO',
    items: [
      'Google Analytics (GA4)',
      'Google Search Console',
      'SEO fundamentals (sitemap, robots.txt, meta tags)',
      'Open Graph share cards',
    ],
  },
  {
    label: 'Marketing',
    items: ['Google Ads / conversion tracking', 'Newsletter signup', 'Social media links'],
  },
  {
    label: 'Content & Commerce',
    items: ['Blog / CMS', 'E-commerce (Stripe)', 'Google Drive embed/storage'],
  },
  {
    label: 'Auth & Compliance',
    items: ['Email/password auth', 'Social login', 'Magic link auth', 'Cookie consent / GDPR banner'],
  },
  {
    label: 'Accessibility',
    items: ['Accessibility basics (alt text, keyboard nav, contrast)'],
  },
];

export function useSetupConnectionStatus(): Record<string, boolean> {
  const supabase = useStore(supabaseConnection);
  const firebase = useStore(firebaseConnection);
  const github = useStore(githubConnection);
  const vercel = useStore(vercelConnection);
  const netlify = useStore(netlifyConnection);

  useEffect(() => {
    /*
     * Unlike Supabase/GitHub/Vercel/Netlify, which read localStorage synchronously at module
     * load, Firebase's store only hydrates via this explicit call — needed here since this
     * hook can render on routes (like /references) that never mount the chatbox widget or
     * Settings tab that would otherwise have triggered it.
     */
    initializeFirebaseConnection();
  }, []);

  return {
    Supabase: !!supabase.isConnected,
    Firebase: !!(firebase.isConnected && firebase.config),
    GitHub: !!github.user,
    Vercel: !!vercel.user,
    Netlify: !!netlify.user,
  };
}

interface SetupChecklistProps {
  selections: SetupSelections;
  onChange: (selections: SetupSelections) => void;
}

export function SetupChecklist({ selections, onChange }: SetupChecklistProps) {
  const connectionStatus = useSetupConnectionStatus();

  /*
   * Tracks which connections we've ever auto-applied, so a later manual uncheck isn't fought
   * on a future render or reload. This has to be its own persisted value, separate from
   * `selections.connections` itself: `selections` can now be restored from localStorage (see
   * usePersistedState) with a connection deliberately removed while still connected, and a
   * seed taken from live connection status at mount can't tell "already decided, stay
   * removed" apart from "not yet reacted to" -- Firebase in particular only hydrates one
   * render after mount (see useSetupConnectionStatus above), so it reads as disconnected on
   * that very first render regardless of its real state.
   */
  const [syncedConnections, setSyncedConnections] = usePersistedState<string[]>(
    'references_setup_synced_connections',
    [],
  );
  const syncedSet = new Set(syncedConnections);

  useEffect(() => {
    const newlyConnected = CONNECTION_ITEMS.filter((item) => connectionStatus[item] && !syncedSet.has(item));

    if (newlyConnected.length === 0) {
      return;
    }

    setSyncedConnections((prev) => Array.from(new Set([...prev, ...newlyConnected])));

    onChange({
      ...selections,
      connections: Array.from(new Set([...selections.connections, ...newlyConnected])),
    });
  }, [
    connectionStatus.Supabase,
    connectionStatus.Firebase,
    connectionStatus.GitHub,
    connectionStatus.Vercel,
    connectionStatus.Netlify,
  ]);

  const toggleConnection = (item: string) => {
    const next = selections.connections.includes(item)
      ? selections.connections.filter((existing) => existing !== item)
      : [...selections.connections, item];
    onChange({ ...selections, connections: next });
  };

  const toggleFeature = (item: string) => {
    const next = selections.features.includes(item)
      ? selections.features.filter((existing) => existing !== item)
      : [...selections.features, item];
    onChange({ ...selections, features: next });
  };

  const totalSelected = (selections.framework ? 1 : 0) + selections.connections.length + selections.features.length;

  return (
    <Dropdown
      align="start"
      trigger={
        <button
          type="button"
          className="px-4 py-2.5 rounded-lg border border-bolt-elements-borderColor bg-bolt-elements-background-depth-1 text-sm font-medium transition-opacity hover:opacity-80"
        >
          + Add setup details{totalSelected > 0 ? ` (${totalSelected})` : ''}
        </button>
      }
    >
      <div className="max-h-[70vh] overflow-y-auto w-72">
        <div className="px-3 py-1.5 text-xs font-semibold text-bolt-elements-textTertiary uppercase tracking-wide">
          Framework — pick one
        </div>
        <div role="radiogroup" aria-label="Framework" className="flex flex-wrap gap-1.5 px-3 pb-2">
          {FRAMEWORK_OPTIONS.map((option) => (
            <DropdownRadioItem
              key={option}
              checked={selections.framework === option}
              onSelect={() => onChange({ ...selections, framework: selections.framework === option ? '' : option })}
            >
              {option}
            </DropdownRadioItem>
          ))}
        </div>

        <DropdownSeparator />

        <div className="px-3 py-1.5 text-xs font-semibold text-bolt-elements-textTertiary uppercase tracking-wide">
          Connections
        </div>
        {CONNECTION_ITEMS.map((item) => (
          <DropdownCheckboxItem
            key={item}
            checked={selections.connections.includes(item)}
            onCheckedChange={() => toggleConnection(item)}
          >
            <span className="flex-1">{item}</span>
            <span
              className={classNames(
                'text-[10px] px-1.5 py-0.5 rounded-full shrink-0',
                connectionStatus[item]
                  ? 'bg-green-500/15 text-green-500'
                  : 'bg-bolt-elements-background-depth-3 text-bolt-elements-textTertiary',
              )}
            >
              {connectionStatus[item] ? 'Connected' : 'Not connected'}
            </span>
          </DropdownCheckboxItem>
        ))}

        {FEATURE_GROUPS.map((group) => (
          <div key={group.label}>
            <DropdownSeparator />
            <div className="px-3 py-1.5 text-xs font-semibold text-bolt-elements-textTertiary uppercase tracking-wide">
              {group.label}
            </div>
            {group.items.map((item) => (
              <DropdownCheckboxItem
                key={item}
                checked={selections.features.includes(item)}
                onCheckedChange={() => toggleFeature(item)}
              >
                <span className="flex-1">{item}</span>
              </DropdownCheckboxItem>
            ))}
          </div>
        ))}

        <DropdownSeparator />
        <DropdownItem className="justify-center font-medium text-accent-500">Done</DropdownItem>
      </div>
    </Dropdown>
  );
}
