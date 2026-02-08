# CLAUDE.md

## Project Overview

This is a **League of Legends (LOL) 1v1 Duel Simulator** — a Chinese-language React SPA originally exported from Figma and built with Vite. It allows users to select heroes, equip items, and simulate 1v1 combat outcomes with win rate predictions, damage breakdowns, and counter-analysis.

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 6.3 with `@vitejs/plugin-react-swc` (SWC for fast compilation)
- **Styling**: Tailwind CSS v4 (CSS-first configuration via `src/styles/globals.css`) + pre-compiled CSS in `src/index.css`
- **UI Components**: shadcn/ui (Radix UI primitives in `src/components/ui/`)
- **Routing**: React Router v7 (`react-router`)
- **Icons**: Lucide React
- **Utilities**: `clsx` + `tailwind-merge` via `cn()` helper in `src/components/ui/utils.ts`

## Quick Commands

```bash
npm install    # Install dependencies
npm run dev    # Start dev server on port 3000
npm run build  # Build to ./build directory
```

## Project Structure

```
src/
├── main.tsx                    # Entry point, renders <App />
├── App.tsx                     # Root component with RouterProvider
├── routes.ts                   # Route definitions (createBrowserRouter)
├── index.css                   # Pre-compiled Tailwind CSS output
├── styles/
│   └── globals.css             # Tailwind v4 theme config & CSS variables
├── types/
│   └── index.ts                # TypeScript interfaces (HeroStats, Item, CombatSettings, etc.)
├── data/
│   ├── heroes.ts               # Hero data (stats, skills, power spikes)
│   └── items.ts                # Item data (stats, cost, passives)
├── utils/
│   └── combat.ts               # Combat simulation logic (DPS, burst, EHP calculations)
├── pages/
│   ├── SoloSimulator.tsx       # Main 1v1 simulator page (/ and /solo)
│   ├── HeroStats.tsx           # Hero attribute viewer (/stats)
│   ├── CounterAnalysis.tsx     # Counter-matchup analysis (/counter)
│   └── ItemSimulator.tsx       # Item build comparison tool (/items)
├── components/
│   ├── Navigation.tsx          # Top + mobile bottom nav bar
│   ├── HeroCard.tsx            # Hero selection card
│   ├── ItemCard.tsx            # Item display card
│   ├── figma/
│   │   └── ImageWithFallback.tsx  # Image component with error fallback
│   └── ui/                     # shadcn/ui components (auto-generated, ~40+ components)
│       ├── utils.ts            # cn() utility function
│       ├── use-mobile.ts       # useIsMobile() hook (768px breakpoint)
│       └── ...                 # button, card, dialog, tabs, etc.
```

## Routes

| Path       | Component        | Description        |
|------------|------------------|--------------------|
| `/`        | SoloSimulator    | 1v1 duel simulator |
| `/solo`    | SoloSimulator    | Same as above      |
| `/stats`   | HeroStats        | Hero attribute viewer |
| `/counter` | CounterAnalysis  | Counter-matchup analysis |
| `/items`   | ItemSimulator    | Item build comparison |

## Key Architecture Decisions

- **No state management library**: All state is local component state via `useState`
- **No backend/API**: All data is hardcoded in `src/data/` files
- **No testing framework configured**: No test scripts or test files exist
- **No ESLint/Prettier configured**: No linting or formatting configs at the project root
- **No TypeScript config at root**: No `tsconfig.json` (relies on Vite defaults)
- **Pre-compiled CSS**: `src/index.css` contains pre-compiled Tailwind output; `src/styles/globals.css` has the Tailwind v4 source config

## Coding Conventions

- **Language**: UI text is in **Chinese (Simplified)**. All hero names, skill descriptions, item names, and UI labels are in Chinese
- **Component style**: Functional components with named exports (e.g., `export function HeroCard()`)
- **File naming**: PascalCase for components (`HeroCard.tsx`), camelCase for utilities (`combat.ts`), kebab-case for UI primitives (`alert-dialog.tsx`)
- **Styling**: Tailwind utility classes directly in JSX. Dark theme with `bg-slate-950` / `bg-slate-900` palette
- **Path aliases**: `@` maps to `./src` (configured in `vite.config.ts`)
- **Type imports**: Uses `import type { ... }` for type-only imports

## Vite Configuration Notes

- **Output directory**: `build/` (not default `dist/`)
- **Dev server**: Port 3000, auto-open browser
- **Build target**: `esnext`
- **Aliases**: Contains versioned package aliases (e.g., `'lucide-react@0.487.0': 'lucide-react'`) from Figma export, plus `@` -> `./src`

## Data Model

### Heroes (`src/data/heroes.ts`)
6 heroes: Yasuo, Fiora, Jax, Darius, Riven, Zed. Each has:
- Base stats with per-level growth values
- 4 skills (Q/W/E/R) with damage, scaling, cooldown
- Power spikes and strong phase (early/mid/late)

### Items (`src/data/items.ts`)
14 items with stats (attack, HP, armor, crit, lifesteal, armor pen) and passive descriptions.

### Combat System (`src/utils/combat.ts`)
- `calculateStats()`: Computes total stats from base + items + level
- `calculateDPS()`: DPS against a target with armor
- `calculateBurstDamage()`: Full combo burst (QWER + 3 auto attacks)
- `calculateEffectiveHP()`: Average of physical and magic EHP
- `simulateCombat()`: Full duel simulation with burst phase (3s) + sustained DPS phase

## Important Notes for AI Assistants

1. **Do not modify `src/components/ui/` files** unless specifically asked — these are shadcn/ui generated components
2. **Maintain Chinese language** for all user-facing text
3. **No test infrastructure exists** — if adding tests, you'll need to set up Vitest or similar
4. **The `src/index.css` is pre-compiled** — style changes should go through `src/styles/globals.css` or inline Tailwind classes
5. **Build verification**: Run `npm run build` to check for TypeScript and build errors
