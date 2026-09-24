# AGENTS.md — GameForge (bolt.diy fork)

## What this is

This repository is a fork of [stackblitz-labs/bolt.diy](https://github.com/stackblitz-labs/bolt.diy)
(MIT licensed), the open-source version of `bolt.new` — an AI agent that writes real code and runs
it live in-browser via StackBlitz's WebContainers. It is being customized into the new core of
**GameForge**, replacing GameForge's previous custom-built, HTML/CSS-based website-creation pipeline
(that older codebase lives on, unchanged, at the existing `tjelano/gameforge` repo — kept as a
working reference and safety net, not merged with this one).

Two remotes are configured on purpose:
- `origin` → `tjelano/bolt.diy` (this fork — push/pull here by default)
- `upstream` → `stackblitz-labs/bolt.diy` (the real project — pull updates from here deliberately,
  never automatically)

No customization work has landed yet as of this file's creation — this is still the unmodified
upstream codebase. The plan (still being worked out) roughly follows: prove the live-runtime
mechanism works end to end, then layer in real customization — GameForge branding, Pixellab's own
official MCP server (`pixellab-code/pixellab-mcp`) as a generation tool instead of GameForge's old
custom Pixellab wrapper, and a required (not optional) grounding step using real reference sites
(similar to GameForge's existing "Inspo" feature) so generated sites don't all converge on the same
generic AI-website look.

## Standing rule: check for upstream fork-drift before every change

Before making any change to this codebase, check whether it touches a file or region that is also
actively maintained upstream, versus using an existing extension point (their LLM provider config,
their MCP server list, a config/env value, an added new file) instead.

- **Uses an existing extension point, or adds a new file:** low risk. A future `git fetch upstream`
  + merge is very unlikely to conflict with this.
- **Edits a file/region upstream also actively changes** (e.g. rewriting their default system prompt
  logic, restructuring their core UI components): flag this explicitly before proceeding — every
  future upstream update to that same area will need a manual merge-conflict resolution here. This
  isn't a reason to avoid the change if it's genuinely needed, but it should be a deliberate,
  named tradeoff each time, not something that happens silently.

When in doubt, prefer the extension point over a direct edit, even if the direct edit is a few lines
shorter — the point of forking a maintained project instead of building from scratch is to keep
benefiting from its upstream fixes and improvements, and that only works if our own changes stay as
narrow and additive as the actual customization requires.

## Updating from upstream

Deliberate and periodic, not automatic:

```bash
git fetch upstream
git merge upstream/main   # resolve any conflicts by hand; expect them in files noted above
```
