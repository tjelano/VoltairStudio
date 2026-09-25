import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import type { SavedReference } from '~/lib/persistence/referencesDb.client';

interface PromptBuilderProps {
  selected: SavedReference[];
}

const DEPLOY_TARGETS = [
  { value: '', label: 'No deployment target' },
  { value: 'Vercel', label: 'Vercel' },
  { value: 'Firebase', label: 'Firebase' },
  { value: 'Netlify', label: 'Netlify' },
] as const;

function buildPrompt(brief: string, selected: SavedReference[], deployTarget: string): string {
  const lines: string[] = [];

  if (brief.trim()) {
    lines.push(brief.trim(), '');
  }

  if (selected.length > 0) {
    lines.push('Use these real sites as design references:');

    for (const ref of selected) {
      const parts = [`- ${ref.title}${ref.siteUrl ? ` (${ref.siteUrl})` : ''}`];

      if (ref.tags.length > 0) {
        parts.push(`[${ref.tags.join(', ')}]`);
      }

      lines.push(parts.join(' '));

      if (ref.northstar) {
        lines.push(`  Look: ${ref.northstar}`);
      }

      if (ref.autopsy) {
        lines.push(`  Design breakdown: ${ref.autopsy.replace(/\n/g, ' ')}`);
      }

      if (ref.note.trim()) {
        lines.push(`  What to borrow: ${ref.note.trim()}`);
      }
    }
  }

  if (deployTarget) {
    lines.push('', `Build this to be deploy-ready for ${deployTarget}.`);
  }

  return lines.join('\n');
}

export function PromptBuilder({ selected }: PromptBuilderProps) {
  const [brief, setBrief] = useState('');
  const [deployTarget, setDeployTarget] = useState('');
  const prompt = useMemo(() => buildPrompt(brief, selected, deployTarget), [brief, selected, deployTarget]);
  const paletteSource = selected.find((ref) => ref.palette && ref.palette.length > 0);

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      toast.success('Prompt copied — paste it into the chat');
    } catch {
      toast.error('Could not copy to clipboard');
    }
  };

  const copyDesignScheme = async () => {
    if (!paletteSource?.palette) {
      return;
    }

    const [primary, secondary, accent] = paletteSource.palette;
    const palette: Record<string, string> = {};

    if (primary) {
      palette.primary = primary;
    }

    if (secondary) {
      palette.secondary = secondary;
    }

    if (accent) {
      palette.accent = accent;
    }

    try {
      await navigator.clipboard.writeText(JSON.stringify({ palette }));
      toast.success('Design Scheme copied — paste it into the Design Palette dialog (Colors tab)');
    } catch {
      toast.error('Could not copy to clipboard');
    }
  };

  return (
    <div className="rounded-xl border border-bolt-elements-borderColor bg-bolt-elements-background-depth-2 shadow-sm p-4 sm:p-6 flex flex-col gap-3">
      <h2 className="text-base font-semibold text-bolt-elements-textPrimary">Build a prompt</h2>
      <div className="flex flex-col sm:flex-row gap-3">
        <textarea
          value={brief}
          onChange={(event) => setBrief(event.target.value)}
          placeholder="What are you building? (e.g. a pricing page for a dev-tools SaaS)"
          className="flex-1 p-2.5 rounded-lg border border-bolt-elements-borderColor bg-bolt-elements-background-depth-1 resize-none focus:outline-none focus:ring-1 focus:ring-purple-500/50"
          rows={2}
        />
        <select
          value={deployTarget}
          onChange={(event) => setDeployTarget(event.target.value)}
          className="p-2.5 rounded-lg border border-bolt-elements-borderColor bg-bolt-elements-background-depth-1 text-sm sm:w-48 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
        >
          {DEPLOY_TARGETS.map((target) => (
            <option key={target.value} value={target.value}>
              {target.label}
            </option>
          ))}
        </select>
      </div>
      <textarea
        value={prompt}
        readOnly
        placeholder="Select references above to build a prompt..."
        className="p-2.5 rounded-lg border border-bolt-elements-borderColor bg-bolt-elements-background-depth-1 text-sm resize-none"
        rows={6}
      />
      <div className="flex items-center justify-end gap-2">
        {paletteSource && (
          <button
            onClick={copyDesignScheme}
            className="px-4 py-2.5 rounded-lg border border-bolt-elements-borderColor bg-bolt-elements-background-depth-1 text-sm font-medium transition-opacity hover:opacity-80"
          >
            Copy as Design Scheme
          </button>
        )}
        <button
          onClick={copyPrompt}
          disabled={!prompt.trim()}
          className="px-5 py-2.5 rounded-lg bg-bolt-elements-button-primary-background text-bolt-elements-button-primary-text font-medium disabled:opacity-50 transition-opacity hover:opacity-90"
        >
          Copy Prompt
        </button>
      </div>
    </div>
  );
}
