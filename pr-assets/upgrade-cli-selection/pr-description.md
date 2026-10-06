## Summary

Keep confirmed choices visible below each upgrade CLI question. Previously, confirming a menu cleared its options and left only the question and keyboard instructions, so the agent and model were no longer visible at the reasoning-effort prompt.

The shared selection helper now prints the selected display label after confirmation. This applies to agent, model, reasoning effort, permission mode, and worktree prompts. Esc and Ctrl+C keep their existing behavior.

## Verification

- Existing agentic-upgrade unit suite: 58 tests and 5 snapshots passed with the modified harness compiled into an isolated `next@canary` installation. Added assertions for retained labels, model-default effort, and reselection after going back.
- Interactive PTY runs exercised all five selection stages, all seven Codex effort options, and all three Claude models.
- Prettier and `git diff --check` passed. Full monorepo bootstrap/build was not run.

## Screenshots

These are actual Chromium screenshots of xterm.js replaying ANSI output captured from the modified CLI running in a real Linux PTY. Fixture Codex/Claude executables supplied model discovery and launch responses; no real project upgrade was run. These are not generated images or screenshots of a website.

<details>
<summary>Agent selection</summary>

![Agent selection](https://raw.githubusercontent.com/devjiwonchoi/next.js/fe9d091eed69ea3d092b41afeb8035d79c03fd70/pr-assets/upgrade-cli-selection/01-agent.png)

</details>

<details>
<summary>Model selection — confirmed agent remains visible</summary>

![Model selection — confirmed agent remains visible](https://raw.githubusercontent.com/devjiwonchoi/next.js/fe9d091eed69ea3d092b41afeb8035d79c03fd70/pr-assets/upgrade-cli-selection/02-model.png)

</details>

<details>
<summary>Reasoning effort — confirmed agent and model remain visible</summary>

![Reasoning effort — confirmed agent and model remain visible](https://raw.githubusercontent.com/devjiwonchoi/next.js/fe9d091eed69ea3d092b41afeb8035d79c03fd70/pr-assets/upgrade-cli-selection/03-effort.png)

</details>

<details>
<summary>Permission mode — confirmed effort remains visible</summary>

![Permission mode — confirmed effort remains visible](https://raw.githubusercontent.com/devjiwonchoi/next.js/fe9d091eed69ea3d092b41afeb8035d79c03fd70/pr-assets/upgrade-cli-selection/04-permission.png)

</details>

<details>
<summary>Worktree — confirmed permission remains visible</summary>

![Worktree — confirmed permission remains visible](https://raw.githubusercontent.com/devjiwonchoi/next.js/fe9d091eed69ea3d092b41afeb8035d79c03fd70/pr-assets/upgrade-cli-selection/05-worktree.png)

</details>

<details>
<summary>All confirmed selections</summary>

![All confirmed selections](https://raw.githubusercontent.com/devjiwonchoi/next.js/fe9d091eed69ea3d092b41afeb8035d79c03fd70/pr-assets/upgrade-cli-selection/06-completed-codex.png)

</details>

[Capture provenance and file hashes](https://raw.githubusercontent.com/devjiwonchoi/next.js/fe9d091eed69ea3d092b41afeb8035d79c03fd70/pr-assets/upgrade-cli-selection/provenance.json) · [Original ANSI recording](https://raw.githubusercontent.com/devjiwonchoi/next.js/fe9d091eed69ea3d092b41afeb8035d79c03fd70/pr-assets/upgrade-cli-selection/03-effort.ansi) · [PTY capture script](https://raw.githubusercontent.com/devjiwonchoi/next.js/fe9d091eed69ea3d092b41afeb8035d79c03fd70/pr-assets/upgrade-cli-selection/capture.py) · [Chromium screenshot script](https://raw.githubusercontent.com/devjiwonchoi/next.js/fe9d091eed69ea3d092b41afeb8035d79c03fd70/pr-assets/upgrade-cli-selection/screenshots.cjs)

<!-- NEXT_JS_LLM -->
