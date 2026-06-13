## CodeScan AI — AI-powered code reviewer for a VS Code webview

A dark, narrow-width (~400px) single-page app that reviews code with AI and renders categorized findings. Built on the existing TanStack Start template.

### AI approach (decided)
Use **Lovable AI Gateway** (your built-in AI, billed from workspace credits) instead of the Anthropic API. `claude-sonnet-4-6` is not available through the gateway, so the review runs on `google/gemini-3-flash-preview`. The model is instructed to return the exact JSON shape you specified. The AI call lives in a **server function** so no key is ever exposed in the browser — the app still behaves as a fully self-contained webview (no login screen, no user-managed key).

### Routing & entry behavior
- Single route `/` (the webview panel).
- On load, read `?code=...&lang=...` from the URL via `validateSearch`.
  - If `code` is present → auto-trigger the review immediately (skip the input screen).
  - If absent → show the manual input screen.

### Screens / states
1. **Manual input** (fallback): full-width monospace `<textarea>`, language dropdown (JavaScript, TypeScript, Python, Go, Rust, Java, C++, Other), and a prominent "Review Code" button.
2. **Loading/scanning**: pulsing code-block placeholder, "Analyzing your code…", and the 4 category labels (Bugs, Security, Quality, Suggestions) fading in one by one (staggered).
3. **Results**:
   - **Top bar**: "CodeScan AI" on the left; language badge + colored letter grade on the right (red D/F, amber C, green A/B).
   - **Tab row**: Bugs · Security · Quality · Suggestions, each with a count badge.
   - **Main panel**: finding cards for the active tab. Each card = severity badge (critical=red, warning=amber, info=blue), bold white title, muted description, optional inline line-number tag, highlighted suggestion block. Empty category → subtle green check + "No issues found".
   - **Sticky bottom bar**: "Review again" (back to input/re-run) and "Copy report" (copies markdown summary to clipboard).
4. **Error state**: clear message for AI failures (rate limit / credits exhausted / parse failure) with retry, preserving entered code.

### Design
- Dark GitHub theme: background `#0d1117`, card/border tones to match, muted-gray body text, white titles.
- Monospace font (JetBrains Mono via `<link>` in `__root.tsx`, referenced through a Tailwind `@theme` token) for all code-related text.
- Smooth tab-switch animations and staggered fades using Framer Motion; no page reloads.
- Tuned for ~400px width (single column, compact spacing, responsive header per the grid/min-w-0 rules).
- Colors added as semantic tokens in `src/styles.css` (severity, grade, category accents) — no ad-hoc color classes in components.

### Technical details
- `src/lib/review.functions.ts` — `reviewCode` server function (`createServerFn`, POST). Input validated with Zod (`code`, `language`). Reads `LOVABLE_API_KEY` inside the handler, calls the gateway via the AI SDK `@ai-sdk/openai-compatible` provider helper, uses a system prompt enforcing the JSON shape (categories: bugs/security/quality/suggestions; severities: critical/warning/info) and returns the parsed object. Surfaces 429/402 errors clearly.
- `src/lib/ai-gateway.server.ts` — gateway provider helper (per the Lovable gateway pattern).
- `src/routes/index.tsx` — replaces the placeholder; owns the state machine (input → loading → results/error), reads search params, calls the server function via `useServerFn` + `useMutation`.
- Components under `src/components/codescan/`: `TopBar`, `GradeBadge`, `CategoryTabs`, `FindingCard`, `ScanningState`, `ManualInput`, `BottomBar`.
- `src/lib/report.ts` — builds the markdown report for "Copy report".
- `src/lib/codescan-types.ts` — shared TS types for the review result.
- Per-route `head()` metadata (title/description) on `/`.
- Dependencies to add: `ai`, `@ai-sdk/openai-compatible`, `zod`, `@tanstack/zod-adapter`, `framer-motion`. Provision `LOVABLE_API_KEY` if missing.

### Notes / trade-offs
- "Truly client-side, no backend" is replaced by a thin server function purely to keep the AI credential secret; from the user's perspective the panel is still self-contained with no login.
- If you later obtain an Anthropic key and want the exact `claude-sonnet-4-6` model, that can be swapped into the same server function without UI changes.
