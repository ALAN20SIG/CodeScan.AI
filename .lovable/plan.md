# GitHub Dark Theme

The CodeScan tokens (`--color-cs-*`) already use GitHub dark colors, but the base shadcn tokens (`--background`, `--primary`, `--card`, buttons, inputs, dialogs, tabs, etc.) still use the default slate palette. This plan retunes those base tokens to GitHub Dark so every component — dialogs, dropdowns, inputs, tabs, tooltips, the config panel — matches.

## Changes

All edits are in `src/styles.css` (no component changes needed since components use semantic tokens).

1. **Make dark the active theme**
   - Ensure the app renders with the `.dark` class applied (set on `<html>` in `src/routes/__root.tsx` if not already), so the GitHub dark values are used app-wide.

2. **Retune shadcn tokens to GitHub Dark** (values expressed in `oklch` to match the existing format), mapping to GitHub's palette:

   ```text
   background        #0d1117  (canvas)
   foreground        #e6edf3  (primary text)
   card / popover     #161b22  (surface)
   card-foreground    #e6edf3
   primary            #238636  (GitHub green) / fg #ffffff
   secondary          #21262d  (button surface) / fg #e6edf3
   muted              #161b22  / muted-fg #8b949e
   accent             #1f6feb  (GitHub blue) / fg #ffffff
   destructive        #da3633  / fg #ffffff
   border             #30363d
   input              #30363d
   ring               #58a6ff  (focus blue)
   ```

   - Update the `.dark` block (and mirror sensible values into `:root` so light-mode fallbacks still read as GitHub-toned) with the above.
   - Optionally tune `--radius` to `0.375rem` for GitHub's tighter corners.

3. **Keep the `--color-cs-*` tokens as-is** — they already match; this just brings the rest of the UI into alignment.

## Notes
- No new fonts needed — JetBrains Mono is already wired for code text; GitHub's UI font stack can stay as the existing sans default.
- Purely presentational: no logic, routing, or server-function changes.
