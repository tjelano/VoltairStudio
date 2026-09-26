import { useState } from 'react';
import { classNames } from '~/utils/classNames';

const QUICK_START = `This is an adversarial code-review technique worth borrowing for any project: alongside whatever AI coding assistant you're using to write code, have a SEPARATE, different-vendor model review it critically before you trust it -- cross-model review catches blind spots a same-model "review my own work" pass can't see.

If the project you're pasting this into already has it set up at .claude/skills/deepseek-review/, just ask Claude Code to "deepseek review this diff" or "deepseek review my plan" once you've set an OPENROUTER_API_KEY (get one at openrouter.ai -- a few dollars of credit covers a huge number of reviews, each call costs fractions of a cent).

To bring the same technique to a different project: the core idea is a plain chat-completions API call (no filesystem access needed) with a system prompt along these lines --

"You are an adversarial reviewer. Your mandate is to kill this [plan/diff], not improve it -- it only survives if you genuinely can't find a way to break it. You have no filesystem access; everything you need will be pasted to you. Attack from three angles: (1) what would a naive read-through miss? (2) does it actually do what it claims? (3) does it cross a hard boundary -- security, data loss, concurrency? One finding per line: what's wrong, why it matters, a one-line fix."

...then paste the diff/plan/relevant code directly into the message (the model can't fetch it itself), and treat every finding as a claim to verify against the real code yourself, not a fact -- expect roughly 1 in 5 "important" findings to actually hold up. The value is in the one that's real, not blind trust in all five.

Worth being explicit about: this pastes real source code into a third-party API. That's a conscious tradeoff to make per-project, not a default to enable without thinking about it.`;

type CopyState = 'idle' | 'copied' | 'failed';

function copyStatusMessage(state: CopyState) {
  if (state === 'copied') {
    return 'Copied to clipboard.';
  }

  if (state === 'failed') {
    return 'Copy failed. Select the text above instead.';
  }

  return '';
}

export default function DeepSeekReviewTab() {
  const [copyState, setCopyState] = useState<CopyState>('idle');

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(QUICK_START);
      setCopyState('copied');
    } catch {
      /*
       * Clipboard access can fail (permissions, insecure context) -- the text is still fully
       * visible and selectable below as a fallback, but say so explicitly rather than leaving
       * the button unchanged, which could read as "nothing happened" rather than "it failed."
       */
      setCopyState('failed');
    } finally {
      setTimeout(() => setCopyState('idle'), 2000);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-bolt-elements-textPrimary">DeepSeek Review</h3>
        <p className="text-sm text-bolt-elements-textSecondary">
          A cross-model adversarial code-review technique this project uses internally — not a VoltairStudio feature, a
          Claude Code skill already set up in this repo.
        </p>
      </div>

      <div className="rounded-lg bg-bolt-elements-background-depth-2 border border-bolt-elements-borderColor p-4 space-y-3">
        <p className="text-sm text-bolt-elements-textPrimary">
          One model writes the code, a different model — DeepSeek V4.1 Flash, via OpenRouter — critiques it before you
          trust it. Cross-model review catches blind spots a same-model &quot;review my own work&quot; pass can&apos;t
          see.
        </p>
        <p className="text-sm text-bolt-elements-textPrimary">
          This repo already has it at{' '}
          <code className="text-xs px-1 py-0.5 rounded bg-bolt-elements-background-depth-3">
            .claude/skills/deepseek-review/
          </code>{' '}
          — if you have Claude Code open here, just ask it to &quot;deepseek review this diff&quot; once you&apos;ve set
          an <code className="text-xs px-1 py-0.5 rounded bg-bolt-elements-background-depth-3">OPENROUTER_API_KEY</code>{' '}
          (get one at{' '}
          <a
            href="https://openrouter.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-500 hover:underline"
          >
            openrouter.ai
          </a>
          ).
        </p>
        <p className="text-xs text-bolt-elements-textTertiary">
          Worth knowing: this pastes real source code and diffs into a third-party API (OpenRouter). That&apos;s a
          conscious tradeoff to make per-project, not a default to enable without thinking about it.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="deepseek-quick-start" className="block text-sm text-bolt-elements-textSecondary">
          Quick-start prompt — copy this into a fresh Claude conversation to bring the technique to a different project
        </label>
        <textarea
          id="deepseek-quick-start"
          readOnly
          value={QUICK_START}
          rows={14}
          onFocus={(event) => event.currentTarget.select()}
          className={classNames(
            'w-full px-3 py-2 rounded-lg text-xs font-mono resize-y',
            'bg-bolt-elements-background-depth-1',
            'border border-bolt-elements-borderColor',
            'text-bolt-elements-textPrimary',
            'focus:outline-none focus:ring-1 focus:ring-accent-500',
          )}
        />
        <button
          type="button"
          onClick={handleCopy}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-accent-500 text-white hover:bg-accent-600 transition-opacity inline-flex items-center gap-2"
        >
          {copyState === 'copied' ? (
            <>
              <div className="i-ph:check-bold w-4 h-4" />
              Copied!
            </>
          ) : copyState === 'failed' ? (
            'Copy failed — select the text above'
          ) : (
            <>
              <div className="i-ph:clipboard-text w-4 h-4" />
              Copy prompt
            </>
          )}
        </button>
        <span role="status" aria-live="polite" className="sr-only">
          {copyStatusMessage(copyState)}
        </span>
      </div>
    </div>
  );
}
