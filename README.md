# The Corporate Decision Lab

A group submission website for **Advanced Corporate Finance** (Prof. Dr. Burcin Yurtoglu,
Master in Entrepreneurship, deadline December 21, 2026).

**Business decisions. Evidence. Responsibility.** — three assignment tasks on five pages:

| Route | Content | Status |
|---|---|---|
| `/` | Homepage: greeting, guide, task index, team | Placeholder team data |
| `/task-1` | Event study on mergers and acquisitions | Structure ready, **results pending** |
| `/task-2` | CEO compensation analysis | Structure ready, **results pending** |
| `/task-3` | CSR essay (summary + DOCX download) and **The Boardroom** game | **Complete** |
| `/stata` | Module 04: Stata do-files & logs (reproducibility appendix) | Assignment snippet live, **group code pending** |

The site is a static single-page app: **Vite + React + TypeScript**, no backend,
no tracking, no external accounts. The player name in the game is kept in
memory for the session only.

---

## Design system: Neo-Swiss Financial Terminal

The whole site follows the supplied design rulebook:

- **Palette** — obsidian canvas `#0B0C0E`, surfaces `#121418`/`#1A1D24`,
  Swiss off-white editorial zones `#F4F3EF`, signal amber `#FF6B00`
  (≈10% of any view), semantic green/red/blue for status.
- **Type** — Anton (display, uppercase), Plus Jakarta Sans (body, 68ch prose),
  JetBrains Mono (labels, numerals with `tabular-nums`). Loaded via Google
  Fonts; the game additionally self-hosts Pixelify Sans from
  `public/game/fonts/`.
- **Structure** — 64px blurred sticky nav with `01 // … 04 //` pillar pills,
  bento KPI strips on task pages, halftone-free terminal panels, kinetic wave
  motif in the hero (SVG, no images), off-white "guide" editorial zone.
- Only the game (`/task-3#boardroom`) uses the pixel look, per the brief.
  Its palette is isolated in `src/game/game.css` (`--g-*` tokens).

Brand-mandated deviations from the internal taste-skill sheet (mono labels,
`01//` numbering, kickers, hairline dividers, nav blur, amber glow) are marked
in source with `taste-skill-ignore` comments.

---

## The Boardroom game

A short branching narrative built on the assignment's two mini-cases
(emissions commitment, factory closure), with three shareholder-governance
perspectives, 3 rounds per case, perspective-aware consequences, and endings
plus a firing rule (`ruleOnFiring` in `src/game/story.ts`).

- **Art**: the team's approved pack from `THE BOARDROOM` lives in
  `public/game/` (backgrounds, BYTE expression sprites, UI icons, briefcase
  FX sheet, endings). Renderer: `src/game/spriteArt.ts`; component:
  `src/game/Boardroom.tsx`.
- **Canvas**: 192×108 logical pixels (per the pack's `STYLE_RULES.md`),
  nearest-neighbour rendering, integer display scales only. Dialogue is
  instant (no typewriter), per the pack's style rules. Talk/blink cycles and
  the briefcase animation respect `prefers-reduced-motion`.
- **Open question**: `public/game/endings/ending_winner.png` says
  "NICE CFO" while the player acts as CEO — flagged "still open" in the
  pack's STYLE_RULES.md, so it is currently **not** displayed. The win path
  shows the ending title + dialogue instead. Say the word and it can be
  wired in (or re-labelled) in minutes.

---

## Running and building

```bash
npm install        # install dependencies
npm run dev        # development server (http://localhost:5173)
npm run build      # production build into dist/
npm run preview    # serve the production build locally
```

## Publishing (private, as agreed)

1. Push this folder to the private GitHub repo (`inettpees-debug/ACF`):
   ```bash
   git init
   git add .
   git commit -m "The Corporate Decision Lab"
   git branch -M main
   git remote add origin git@github.com:inettpees-debug/ACF.git
   git push -u origin main
   ```
2. In Netlify: **Add new site → Import an existing project → GitHub → ACF**.
   `netlify.toml` already sets the build command and publish directory.
3. To keep it private on Netlify, use **Site configuration → Access & privacy**
   (password protection requires a paid Netlify plan) — or keep the site
   undeployed and share preview URLs from your own machine until submission.

---

## Where to add the missing material

Everything still outstanding is a clearly marked placeholder on the site.
Nothing placeholder is presented as finished work.

### 1. Task 01 & Task 02 documents (pending)

- Drop the final files into **`public/documents/`**, e.g.
  `Task-01.pdf` and `Task-02.pdf`.
- Register them in **`src/data/site.ts`** → `documents` (set `pdf` or `docx`
  to the file name). The download panels on the task pages, the game control
  strip and the footer pick them up automatically. A pending document never
  renders a download link.

### 2. Task 01 & Task 02 results and datasets (pending)

- Put the figures/tables you want visualized into **`src/data/`** (e.g.
  `task1Results.ts`, `task2Results.ts`) — transcribed from the final write-up
  only.
- Build the interactive explorers inside `src/pages/Task1.tsx` / `Task2.tsx`
  where reserved placeholder panels already sit. Charts must show only values
  from the supplied analysis (axes labeled, units, source, table alternative).

### 3. Team portraits and LinkedIn URLs (pending)

- Portraits: add files (e.g. `public/team/henric.jpg`, 4:5 crop) and replace
  the placeholder slots in **`src/pages/Home.tsx`** (`.member-portrait`).
- LinkedIn: add the real URLs in **`src/data/site.ts`** → `teamMembers`
  (add a `linkedin` field per member) and render them in the member cards —
  `target="_blank" rel="noopener noreferrer"`. Never invent profile URLs.

### 4. Essay PDF (optional)

- If a PDF version of the CSR essay is supplied, add
  `public/documents/Task-03-CSR-Essay.pdf` and set `pdf` in
  `src/data/site.ts` → `documents["task-3"]`. DOCX stays as the alternative.

### 5. Stata do-files and logs (pending)

- `/stata` shows the professor's assigned variable-construction snippet
  (quoted verbatim, with copy button). Drop the group's final
  `task01_eventstudy.do` / `task02_excomp.do` and their `.log` outputs into
  `public/documents/` (or embed the code as strings in `src/pages/Stata.tsx`)
  and replace the pending slots.

### 6. Game dialogue and branches

All narrative lives in **`src/game/story.ts`** as structured data: rounds,
choices (`setFlags` + `consequence` lines), endings (`condition` + `lines`),
perspective reactions, and the firing rules in `ruleOnFiring`. Edit the data —
not the component — to change dialogue, add choices, or retune endings.
Types are in `src/game/types.ts`.

---

## Design and implementation notes

- The rulebook targets Next.js/Tailwind; this project keeps the
  Vite + React + TypeScript stack from the original brief and implements the
  rulebook via its CSS variables and type scale directly
  (`src/styles/tokens.css`). No new runtime dependencies were added.
- All academic content comes from the professor's assignment sheet and the
  group's final essay. No figures, results, or references are invented;
  pending material is labeled as pending.
- The essay page shows only the paper's own summary paragraph (from its
  introduction) plus the download — per the team's decision the full text is
  not reproduced on the site.
- Accessibility: semantic HTML, keyboard-operable game controls, visible
  focus states, `prefers-reduced-motion` fallbacks everywhere, dialogue
  announced via `aria-live`.

## Still missing from the team (checklist)

- [ ] Task 01 final write-up (PDF) + dataset/results for the data explorer
- [ ] Task 02 final write-up (PDF) + dataset/results for the results explorer
- [ ] Stata do-files + logs for module 04
- [ ] Five team portraits (consistent 4:5 crop)
- [ ] Five LinkedIn profile URLs
- [ ] Decision: use `ending_winner.png` ("NICE CFO") or keep it out?
- [ ] Optional: PDF export of the CSR essay
