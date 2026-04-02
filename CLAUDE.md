# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Xinxin Pet (鑫鑫宠物) — a Chinese-language virtual pet nurturing and adventure browser game. Pure vanilla TypeScript + DOM manipulation, no frameworks. Built with Vite.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — type-check (`tsc`) then production build
- `npm run preview` — preview production build

No tests, linters, or formatters are configured.

## Architecture

### Entry & Routing

`index.html` is the SPA shell containing all view `<section>` elements. `src/main.ts` handles routing by mapping game phases to sections and toggling a `hidden` class via `showView()`. Phases: `egg_selection` → `hatching` → `birth` → `nurture` → `adventure`.

### State Management

`src/gameState.ts` — single `GameData` object with an observer pattern (`subscribe`/`notify`). Persistence via `localStorage` (key: `xinxin_pet_save`). On load, data is merged with defaults for forward-compatibility and migrated from legacy single-pet format to multi-pet array.

### Module Convention

Each game phase has a module exporting an `init*()` function (e.g., `initEggSelection()`, `initHatching()`). Modules import each other directly — no DI container.

### Key Modules

- `petData.ts` — species definitions (6 species × 10 evolution stages), item catalog
- `combat.ts` — `CombatEngine` class with static methods for damage calculation, monster AI, turn order, rival generation
- `taskSystem.ts` / `taskPanel.ts` — daily tasks, achievements, shop, quiz mini-games
- `animations.ts` — canvas star field, particle effects, floating text, tilt interactions
- `petNurture.ts` — main dashboard: pet display, inventory, stat interactions
- `style.css` — single ~48KB file using CSS custom properties as design tokens, glassmorphism (`.glass-card`), dark theme

### Data Flow

1. `gameState.ts` holds all data and exposes `getState()` / `setState()` / `save()` / `load()`
2. View modules read state, manipulate DOM imperatively, then call `setState()` + `save()` to persist
3. State subscriptions trigger view switches in `main.ts`

### CSS

Design tokens via CSS custom properties (colors, spacing, radii). Glassmorphism pattern. Animations via CSS keyframes and JS-triggered class toggles.

## Code Style

- Chinese comments and UI strings throughout
- File headers use `// =======` separator
- TypeScript strict mode, ES2023 target, ES modules (`"type": "module"`)
- No external runtime dependencies — only devDependencies (typescript, vite)
- Functional game logic, imperative DOM manipulation for views
