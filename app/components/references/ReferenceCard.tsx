import type { InspoScreen } from './types';

interface ReferenceCardProps {
  screen: InspoScreen;
  saved?: boolean;
  onSave?: () => void;
  onRemove?: () => void;
  note?: string;
  onNoteChange?: (note: string) => void;
  selected?: boolean;
  onToggleSelect?: () => void;
}

export function ReferenceCard({
  screen,
  saved,
  onSave,
  onRemove,
  note,
  onNoteChange,
  selected,
  onToggleSelect,
}: ReferenceCardProps) {
  const domain = (() => {
    try {
      return new URL(screen.sourceUrl).hostname.replace(/^www\./, '');
    } catch {
      return screen.sourceUrl;
    }
  })();

  return (
    <div className="flex flex-col rounded-xl border border-bolt-elements-borderColor bg-bolt-elements-background-depth-2 overflow-hidden shadow-sm hover:shadow-md hover:border-bolt-elements-borderColorActive transition-all duration-150">
      <div className="relative">
        {onToggleSelect && (
          <input
            type="checkbox"
            checked={!!selected}
            onChange={onToggleSelect}
            className="absolute top-2 left-2 w-4 h-4 z-10 accent-purple-500"
          />
        )}
        <img
          src={screen.thumb}
          alt={screen.title}
          crossOrigin="anonymous"
          className="w-full h-40 object-cover object-top bg-bolt-elements-background-depth-3"
          loading="lazy"
        />
      </div>
      <div className="p-3.5 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="font-medium text-sm text-bolt-elements-textPrimary truncate">{screen.title}</div>
            <div className="text-xs text-bolt-elements-textSecondary truncate">{domain}</div>
          </div>
          {saved ? (
            <button
              onClick={onRemove}
              className="text-xs px-2.5 py-1 rounded-md bg-bolt-elements-button-danger-background text-bolt-elements-button-danger-text shrink-0 hover:opacity-90 transition-opacity"
            >
              Remove
            </button>
          ) : (
            <button
              onClick={onSave}
              className="text-xs px-2.5 py-1 rounded-md bg-bolt-elements-button-primary-background text-bolt-elements-button-primary-text shrink-0 hover:opacity-90 transition-opacity"
            >
              Save
            </button>
          )}
        </div>
        {screen.northstar && (
          <p className="text-xs text-bolt-elements-textSecondary line-clamp-2">{screen.northstar}</p>
        )}
        {screen.macrostructure && (
          <span className="text-xs w-fit px-2 py-0.5 rounded-full bg-bolt-elements-background-depth-3 text-bolt-elements-textSecondary">
            {screen.macrostructure.label}
          </span>
        )}
        {saved && onNoteChange && (
          <textarea
            value={note ?? ''}
            onChange={(event) => onNoteChange(event.target.value)}
            placeholder="Notes on what to borrow from this..."
            className="text-xs p-2 rounded-lg border border-bolt-elements-borderColor bg-bolt-elements-background-depth-1 resize-none focus:outline-none focus:ring-1 focus:ring-purple-500/50"
            rows={2}
          />
        )}
      </div>
    </div>
  );
}
