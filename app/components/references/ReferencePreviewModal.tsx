import * as RadixDialog from '@radix-ui/react-dialog';
import { Dialog, DialogTitle, DialogButton } from '~/components/ui/Dialog';
import type { InspoScreen } from './types';

/*
 * Inspo's real autopsy format is always these 4 labeled sections. Splitting on a blank line
 * (the naive approach) breaks if a section's own body text ever contains one; splitting right
 * before a known label instead is robust to that and to any other incidental whitespace.
 */
const AUTOPSY_SECTION_LABELS = ['FOLD', 'TYPE', 'COLOR', 'SIGNATURE'];
const AUTOPSY_SPLIT_PATTERN = new RegExp(`(?=(?:${AUTOPSY_SECTION_LABELS.join('|')}):)`);

function splitAutopsySections(autopsy: string): string[] {
  return autopsy
    .split(AUTOPSY_SPLIT_PATTERN)
    .map((section) => section.trim())
    .filter(Boolean);
}

interface ReferencePreviewModalProps {
  screen: InspoScreen | null;
  loadingMore: boolean;
  saved: boolean;
  onClose: () => void;
  onSave: () => void;
  onRemove: () => void;
}

export function ReferencePreviewModal({
  screen,
  loadingMore,
  saved,
  onClose,
  onSave,
  onRemove,
}: ReferencePreviewModalProps) {
  const open = !!screen;

  const domain = screen
    ? (() => {
        try {
          return new URL(screen.sourceUrl).hostname.replace(/^www\./, '');
        } catch {
          return screen.sourceUrl;
        }
      })()
    : '';

  return (
    <RadixDialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <Dialog className="w-[640px] max-h-[85vh] overflow-y-auto" onClose={onClose}>
        <div className="p-6 pr-10 bg-white dark:bg-gray-950 flex flex-col gap-4">
          {screen ? (
            <>
              <DialogTitle>{screen.title}</DialogTitle>
              <a
                href={screen.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-accent-500 hover:underline -mt-3 inline-flex items-center gap-1 w-fit"
              >
                {domain}
                <div className="i-ph:arrow-square-out w-3.5 h-3.5" />
              </a>

              <img
                src={screen.thumb}
                alt={screen.title}
                crossOrigin="anonymous"
                className="w-full max-h-80 object-cover object-top rounded-lg border border-bolt-elements-borderColor"
              />

              {screen.northstar && (
                <p className="text-sm italic text-bolt-elements-textSecondary">{screen.northstar}</p>
              )}

              {screen.palette && screen.palette.length > 0 && (
                <div className="flex items-center gap-2">
                  {screen.palette.map((hex) => (
                    <div
                      key={hex}
                      title={hex}
                      className="w-6 h-6 rounded-full border border-bolt-elements-borderColor"
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
              )}

              {screen.autopsy ? (
                <div className="flex flex-col gap-3 text-sm text-bolt-elements-textPrimary">
                  {splitAutopsySections(screen.autopsy).map((section, index) => {
                    const [label, ...rest] = section.split(':');
                    const body = rest.join(':').trim();

                    return (
                      <p key={index}>
                        {body ? (
                          <>
                            <span className="font-semibold text-bolt-elements-textSecondary">{label}:</span> {body}
                          </>
                        ) : (
                          section
                        )}
                      </p>
                    );
                  })}
                </div>
              ) : loadingMore ? (
                <p className="text-sm text-bolt-elements-textTertiary">Loading design breakdown...</p>
              ) : (
                <p className="text-sm text-bolt-elements-textTertiary">No design breakdown available for this one.</p>
              )}

              <div className="flex justify-end gap-2 mt-2">
                {saved ? (
                  <DialogButton type="danger" onClick={onRemove}>
                    Remove
                  </DialogButton>
                ) : (
                  <DialogButton type="primary" onClick={onSave}>
                    Save
                  </DialogButton>
                )}
              </div>
            </>
          ) : null}
        </div>
      </Dialog>
    </RadixDialog.Root>
  );
}
