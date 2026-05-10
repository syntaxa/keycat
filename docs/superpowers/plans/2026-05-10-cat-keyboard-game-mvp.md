# Cat Keyboard Game MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a playable browser MVP of the Russian-language cat keyboard game with layout selection, letter objects, staged hints, soft mistake feedback, rewards, stacked inventory, and local progress.

**Architecture:** Use a Vite React TypeScript app. Keep learning logic in pure TypeScript modules with Vitest coverage, and keep React components thin: they render state, dispatch user actions, and play simple CSS animations. Store profile progress in localStorage through one persistence adapter.

**Tech Stack:** Vite, React, TypeScript, Vitest, Testing Library, CSS modules or plain CSS, localStorage.

---

## Scope

This plan builds the first playable vertical slice, not the full long-term game. The MVP includes:

- Russian UI.
- Russian and English layout selection.
- Independent layout progress.
- One side-view cat room.
- Letter objects on decor/toy items.
- Physical keyboard input.
- Staged hint system: quarter, row, exact key.
- Cat success and mistake states, including a brief cartoon tear on mistakes.
- Session summary with experience and reward.
- A small decor inventory with Minecraft-like stacked duplicates.
- Local profile save/load.

Later plans should add more rooms, more animals, egg opening animation polish, richer rarity tables, parent dashboard detail, and production art.

## File Structure

Create these files:

- `package.json`: project scripts and dependencies.
- `index.html`: Vite entry HTML.
- `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`: TypeScript and Vite configuration.
- `src/main.tsx`: React entry point.
- `src/App.tsx`: top-level app state and screen routing.
- `src/styles.css`: global cartoon UI styles, thin black outlines, responsive layout.
- `src/domain/types.ts`: shared domain types.
- `src/domain/keyboardLayouts.ts`: Russian and English keyboard layout data.
- `src/domain/hints.ts`: staged hint calculation.
- `src/domain/tutor.ts`: adaptive letter selection and session pacing.
- `src/domain/session.ts`: pure session reducer for input, mistakes, success, and summary.
- `src/domain/progression.ts`: XP, milestones, rewards, egg progress, and decor reward selection.
- `src/domain/inventory.ts`: stacked item inventory operations.
- `src/domain/profile.ts`: default profile and profile update helpers.
- `src/storage/localProfileStore.ts`: localStorage adapter.
- `src/ui/LayoutSelect.tsx`: Russian UI for choosing layout.
- `src/ui/GameScreen.tsx`: room, current task, keyboard input binding, and session controls.
- `src/ui/RoomScene.tsx`: side-view cartoon room with cat and active letter object.
- `src/ui/MiniKeyboard.tsx`: keyboard hint visualization.
- `src/ui/RewardScreen.tsx`: post-session reward summary.
- `src/ui/InventoryPanel.tsx`: stacked decor inventory display.
- `src/ui/ProgressPanel.tsx`: level, layout, XP, and current session status.
- `src/test/setup.ts`: test setup.
- `src/domain/*.test.ts`: unit tests for pure domain logic.
- `src/ui/*.test.tsx`: focused component tests for Russian UI and basic interactions.

Modify these files:

- `docs/superpowers/specs/2026-05-10-cat-keyboard-game-design.md`: only if implementation discoveries require a spec clarification.

## Task 1: Scaffold The App

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles.css`
- Create: `src/test/setup.ts`

- [ ] **Step 1: Create project configuration**

Write `package.json`:

```json
{
  "name": "keycat",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@vitejs/plugin-react": "^5.0.0",
    "vite": "^7.0.0",
    "typescript": "^5.8.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/react": "^16.2.0",
    "@testing-library/user-event": "^14.6.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "jsdom": "^26.0.0",
    "vitest": "^3.0.0"
  }
}
```

Write `index.html`:

```html
<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>КлавоКот</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Write `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Write `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

Write `vite.config.ts`:

```ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["src/test/setup.ts"],
    globals: true
  }
});
```

- [ ] **Step 2: Create minimal React entry**

Write `src/main.tsx`:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

Write `src/App.tsx`:

```tsx
export function App() {
  return (
    <main className="app-shell">
      <section className="hero-panel">
        <h1>КлавоКот</h1>
        <p>Учимся находить буквы на клавиатуре вместе с котиками.</p>
      </section>
    </main>
  );
}
```

Write `src/styles.css`:

```css
:root {
  font-family: "Trebuchet MS", Arial, sans-serif;
  color: #241816;
  background: #f8eecf;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
}

button {
  font: inherit;
}

.app-shell {
  min-height: 100vh;
  padding: 24px;
  background:
    linear-gradient(#fff7db 0 0) padding-box,
    linear-gradient(135deg, #f7c85f, #87c8ee, #f59cab) border-box;
}

.hero-panel {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px;
  border: 2px solid #171313;
  border-radius: 8px;
  background: #fffaf0;
  box-shadow: 4px 4px 0 #171313;
}

.hero-panel h1 {
  margin: 0 0 8px;
  font-size: 42px;
}
```

Write `src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 3: Install dependencies**

Run: `npm install`

Expected: `package-lock.json` is created and npm exits successfully.

- [ ] **Step 4: Verify scaffold**

Run: `npm run build`

Expected: TypeScript and Vite build complete successfully.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json index.html tsconfig.json tsconfig.node.json vite.config.ts src/main.tsx src/App.tsx src/styles.css src/test/setup.ts
git commit -m "chore: scaffold keycat app"
```

## Task 2: Define Core Domain Types And Keyboard Layouts

**Files:**
- Create: `src/domain/types.ts`
- Create: `src/domain/keyboardLayouts.ts`
- Create: `src/domain/keyboardLayouts.test.ts`

- [ ] **Step 1: Write failing layout tests**

Write `src/domain/keyboardLayouts.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { keyboardLayouts } from "./keyboardLayouts";

describe("keyboardLayouts", () => {
  it("defines Russian and English layouts", () => {
    expect(keyboardLayouts.ru.label).toBe("Русская");
    expect(keyboardLayouts.en.label).toBe("English");
  });

  it("assigns every letter a row, quarter, and display label", () => {
    for (const layout of Object.values(keyboardLayouts)) {
      for (const key of layout.keys) {
        expect(key.letter.length).toBeGreaterThan(0);
        expect(["top", "home", "bottom"]).toContain(key.row);
        expect(["left", "centerLeft", "centerRight", "right"]).toContain(key.quarter);
        expect(key.display.length).toBeGreaterThan(0);
      }
    }
  });

  it("keeps layout letters unique", () => {
    for (const layout of Object.values(keyboardLayouts)) {
      const letters = layout.keys.map((key) => key.letter);
      expect(new Set(letters).size).toBe(letters.length);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/domain/keyboardLayouts.test.ts`

Expected: FAIL because `src/domain/keyboardLayouts.ts` does not exist.

- [ ] **Step 3: Implement types and layout data**

Write `src/domain/types.ts`:

```ts
export type LayoutId = "ru" | "en";
export type KeyboardRow = "top" | "home" | "bottom";
export type KeyboardQuarter = "left" | "centerLeft" | "centerRight" | "right";
export type HintStage = "none" | "quarter" | "row" | "key";
export type CatMood = "idle" | "happy" | "mistake";
export type ItemCategory =
  | "beds"
  | "toys"
  | "furniture"
  | "textiles"
  | "care"
  | "plants"
  | "decorations"
  | "special";

export interface KeyDefinition {
  letter: string;
  display: string;
  code: string;
  row: KeyboardRow;
  quarter: KeyboardQuarter;
  unlockOrder: number;
}

export interface KeyboardLayout {
  id: LayoutId;
  label: string;
  keys: KeyDefinition[];
}

export interface LetterProgress {
  attempts: number;
  correct: number;
  totalResponseMs: number;
  mastered: boolean;
}

export interface LayoutProgress {
  unlockedLetters: string[];
  letters: Record<string, LetterProgress>;
}

export interface InventoryStack {
  itemId: string;
  count: number;
  isNew: boolean;
  favorite: boolean;
}

export interface PlacedItem {
  instanceId: string;
  itemId: string;
  x: number;
  y: number;
}

export interface Profile {
  selectedLayout: LayoutId;
  level: number;
  xp: number;
  eggProgress: number;
  layoutProgress: Record<LayoutId, LayoutProgress>;
  inventory: InventoryStack[];
  placedItems: PlacedItem[];
}
```

Write `src/domain/keyboardLayouts.ts`:

```ts
import type { KeyboardLayout, KeyboardQuarter, KeyboardRow } from "./types";

function key(
  letter: string,
  display: string,
  code: string,
  row: KeyboardRow,
  quarter: KeyboardQuarter,
  unlockOrder: number
) {
  return { letter, display, code, row, quarter, unlockOrder };
}

export const keyboardLayouts: Record<"ru" | "en", KeyboardLayout> = {
  ru: {
    id: "ru",
    label: "Русская",
    keys: [
      key("й", "Й", "KeyQ", "top", "left", 13),
      key("ц", "Ц", "KeyW", "top", "left", 14),
      key("у", "У", "KeyE", "top", "centerLeft", 5),
      key("к", "К", "KeyR", "top", "centerLeft", 3),
      key("е", "Е", "KeyT", "top", "centerLeft", 7),
      key("н", "Н", "KeyY", "top", "centerRight", 8),
      key("г", "Г", "KeyU", "top", "centerRight", 15),
      key("ш", "Ш", "KeyI", "top", "centerRight", 21),
      key("щ", "Щ", "KeyO", "top", "right", 22),
      key("з", "З", "KeyP", "top", "right", 20),
      key("ф", "Ф", "KeyA", "home", "left", 16),
      key("ы", "Ы", "KeyS", "home", "left", 10),
      key("в", "В", "KeyD", "home", "centerLeft", 2),
      key("а", "А", "KeyF", "home", "centerLeft", 1),
      key("п", "П", "KeyG", "home", "centerLeft", 9),
      key("р", "Р", "KeyH", "home", "centerRight", 6),
      key("о", "О", "KeyJ", "home", "centerRight", 4),
      key("л", "Л", "KeyK", "home", "centerRight", 11),
      key("д", "Д", "KeyL", "home", "right", 12),
      key("я", "Я", "KeyZ", "bottom", "left", 17),
      key("ч", "Ч", "KeyX", "bottom", "left", 18),
      key("с", "С", "KeyC", "bottom", "centerLeft", 19),
      key("м", "М", "KeyV", "bottom", "centerLeft", 23),
      key("и", "И", "KeyB", "bottom", "centerLeft", 24),
      key("т", "Т", "KeyN", "bottom", "centerRight", 25),
      key("ь", "Ь", "KeyM", "bottom", "centerRight", 26),
      key("б", "Б", "Comma", "bottom", "right", 27),
      key("ю", "Ю", "Period", "bottom", "right", 28)
    ]
  },
  en: {
    id: "en",
    label: "English",
    keys: [
      key("q", "Q", "KeyQ", "top", "left", 13),
      key("w", "W", "KeyW", "top", "left", 14),
      key("e", "E", "KeyE", "top", "centerLeft", 5),
      key("r", "R", "KeyR", "top", "centerLeft", 3),
      key("t", "T", "KeyT", "top", "centerLeft", 7),
      key("y", "Y", "KeyY", "top", "centerRight", 8),
      key("u", "U", "KeyU", "top", "centerRight", 15),
      key("i", "I", "KeyI", "top", "centerRight", 21),
      key("o", "O", "KeyO", "top", "right", 4),
      key("p", "P", "KeyP", "top", "right", 20),
      key("a", "A", "KeyA", "home", "left", 1),
      key("s", "S", "KeyS", "home", "left", 10),
      key("d", "D", "KeyD", "home", "centerLeft", 2),
      key("f", "F", "KeyF", "home", "centerLeft", 6),
      key("g", "G", "KeyG", "home", "centerLeft", 9),
      key("h", "H", "KeyH", "home", "centerRight", 11),
      key("j", "J", "KeyJ", "home", "centerRight", 12),
      key("k", "K", "KeyK", "home", "centerRight", 16),
      key("l", "L", "KeyL", "home", "right", 17),
      key("z", "Z", "KeyZ", "bottom", "left", 18),
      key("x", "X", "KeyX", "bottom", "left", 19),
      key("c", "C", "KeyC", "bottom", "centerLeft", 22),
      key("v", "V", "KeyV", "bottom", "centerLeft", 23),
      key("b", "B", "KeyB", "bottom", "centerLeft", 24),
      key("n", "N", "KeyN", "bottom", "centerRight", 25),
      key("m", "M", "KeyM", "bottom", "centerRight", 26)
    ]
  }
};
```

- [ ] **Step 4: Run tests**

Run: `npm test -- src/domain/keyboardLayouts.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/domain/types.ts src/domain/keyboardLayouts.ts src/domain/keyboardLayouts.test.ts
git commit -m "feat: add keyboard layout data"
```

## Task 3: Build Hint Logic

**Files:**
- Create: `src/domain/hints.ts`
- Create: `src/domain/hints.test.ts`

- [ ] **Step 1: Write failing hint tests**

Write `src/domain/hints.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getHintForStage, nextHintAfterDelay, nextHintAfterMistake } from "./hints";
import { keyboardLayouts } from "./keyboardLayouts";

const letterA = keyboardLayouts.ru.keys.find((key) => key.letter === "а")!;

describe("hints", () => {
  it("returns no highlight for none stage", () => {
    expect(getHintForStage(letterA, "none")).toEqual({ stage: "none" });
  });

  it("reveals quarter, row, then key", () => {
    expect(getHintForStage(letterA, "quarter")).toEqual({ stage: "quarter", quarter: "centerLeft" });
    expect(getHintForStage(letterA, "row")).toEqual({ stage: "row", row: "home" });
    expect(getHintForStage(letterA, "key")).toEqual({ stage: "key", code: "KeyF" });
  });

  it("increases hint strength after delay or mistake", () => {
    expect(nextHintAfterDelay("none")).toBe("quarter");
    expect(nextHintAfterDelay("quarter")).toBe("row");
    expect(nextHintAfterMistake("row")).toBe("key");
    expect(nextHintAfterMistake("key")).toBe("key");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/domain/hints.test.ts`

Expected: FAIL because `src/domain/hints.ts` does not exist.

- [ ] **Step 3: Implement hint logic**

Write `src/domain/hints.ts`:

```ts
import type { HintStage, KeyDefinition, KeyboardQuarter, KeyboardRow } from "./types";

export type ActiveHint =
  | { stage: "none" }
  | { stage: "quarter"; quarter: KeyboardQuarter }
  | { stage: "row"; row: KeyboardRow }
  | { stage: "key"; code: string };

export function getHintForStage(key: KeyDefinition, stage: HintStage): ActiveHint {
  if (stage === "quarter") return { stage, quarter: key.quarter };
  if (stage === "row") return { stage, row: key.row };
  if (stage === "key") return { stage, code: key.code };
  return { stage: "none" };
}

export function nextHintAfterDelay(stage: HintStage): HintStage {
  if (stage === "none") return "quarter";
  if (stage === "quarter") return "row";
  return "key";
}

export function nextHintAfterMistake(stage: HintStage): HintStage {
  if (stage === "none") return "row";
  return "key";
}

export function softenHintAfterSuccess(stage: HintStage): HintStage {
  if (stage === "key") return "row";
  if (stage === "row") return "quarter";
  return "none";
}
```

- [ ] **Step 4: Run tests**

Run: `npm test -- src/domain/hints.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/domain/hints.ts src/domain/hints.test.ts
git commit -m "feat: add staged keyboard hints"
```

## Task 4: Add Profile, Inventory, And Progression

**Files:**
- Create: `src/domain/profile.ts`
- Create: `src/domain/inventory.ts`
- Create: `src/domain/progression.ts`
- Create: `src/domain/inventory.test.ts`
- Create: `src/domain/progression.test.ts`

- [ ] **Step 1: Write failing inventory tests**

Write `src/domain/inventory.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { addItem, placeItem, removePlacedItem } from "./inventory";
import type { Profile } from "./types";
import { createDefaultProfile } from "./profile";

describe("inventory", () => {
  it("stacks duplicate decor items", () => {
    let profile: Profile = createDefaultProfile();
    profile = addItem(profile, "yarn-ball");
    profile = addItem(profile, "yarn-ball");

    expect(profile.inventory).toEqual([
      { itemId: "yarn-ball", count: 2, isNew: true, favorite: false }
    ]);
  });

  it("moves one stacked item into the room and back", () => {
    let profile = addItem(createDefaultProfile(), "cat-pillow");
    profile = addItem(profile, "cat-pillow");
    profile = placeItem(profile, "cat-pillow", { x: 20, y: 70 }, "placed-1");

    expect(profile.inventory.find((item) => item.itemId === "cat-pillow")?.count).toBe(1);
    expect(profile.placedItems).toEqual([{ instanceId: "placed-1", itemId: "cat-pillow", x: 20, y: 70 }]);

    profile = removePlacedItem(profile, "placed-1");

    expect(profile.inventory.find((item) => item.itemId === "cat-pillow")?.count).toBe(2);
    expect(profile.placedItems).toEqual([]);
  });
});
```

- [ ] **Step 2: Write failing progression tests**

Write `src/domain/progression.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { applySessionReward } from "./progression";
import { createDefaultProfile } from "./profile";

describe("progression", () => {
  it("adds xp and levels up at milestones", () => {
    const profile = applySessionReward(createDefaultProfile(), {
      xp: 120,
      decorItemId: "sunny-rug",
      eggProgress: 1
    });

    expect(profile.level).toBe(2);
    expect(profile.xp).toBe(20);
    expect(profile.inventory.find((item) => item.itemId === "sunny-rug")?.count).toBe(1);
    expect(profile.eggProgress).toBe(1);
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm test -- src/domain/inventory.test.ts src/domain/progression.test.ts`

Expected: FAIL because profile, inventory, and progression modules do not exist.

- [ ] **Step 4: Implement profile and inventory**

Write `src/domain/profile.ts`:

```ts
import type { LayoutId, LayoutProgress, Profile } from "./types";

function createLayoutProgress(initialLetters: string[]): LayoutProgress {
  return {
    unlockedLetters: initialLetters,
    letters: Object.fromEntries(
      initialLetters.map((letter) => [
        letter,
        { attempts: 0, correct: 0, totalResponseMs: 0, mastered: false }
      ])
    )
  };
}

export function createDefaultProfile(selectedLayout: LayoutId = "ru"): Profile {
  return {
    selectedLayout,
    level: 1,
    xp: 0,
    eggProgress: 0,
    layoutProgress: {
      ru: createLayoutProgress(["а", "в", "к", "о"]),
      en: createLayoutProgress(["a", "d", "r", "o"])
    },
    inventory: [],
    placedItems: []
  };
}
```

Write `src/domain/inventory.ts`:

```ts
import type { InventoryStack, Profile } from "./types";

export function addItem(profile: Profile, itemId: string): Profile {
  const existing = profile.inventory.find((item) => item.itemId === itemId);
  const inventory = existing
    ? profile.inventory.map((item) =>
        item.itemId === itemId ? { ...item, count: item.count + 1, isNew: true } : item
      )
    : [...profile.inventory, { itemId, count: 1, isNew: true, favorite: false } satisfies InventoryStack];

  return { ...profile, inventory };
}

export function placeItem(
  profile: Profile,
  itemId: string,
  position: { x: number; y: number },
  instanceId = crypto.randomUUID()
): Profile {
  const stack = profile.inventory.find((item) => item.itemId === itemId);
  if (!stack || stack.count <= 0) return profile;

  const inventory = profile.inventory
    .map((item) => (item.itemId === itemId ? { ...item, count: item.count - 1, isNew: false } : item))
    .filter((item) => item.count > 0);

  return {
    ...profile,
    inventory,
    placedItems: [...profile.placedItems, { instanceId, itemId, x: position.x, y: position.y }]
  };
}

export function removePlacedItem(profile: Profile, instanceId: string): Profile {
  const placed = profile.placedItems.find((item) => item.instanceId === instanceId);
  if (!placed) return profile;

  return {
    ...addItem(profile, placed.itemId),
    placedItems: profile.placedItems.filter((item) => item.instanceId !== instanceId)
  };
}
```

- [ ] **Step 5: Implement progression**

Write `src/domain/progression.ts`:

```ts
import { addItem } from "./inventory";
import type { Profile } from "./types";

export interface SessionReward {
  xp: number;
  decorItemId: string;
  eggProgress: number;
}

export const LEVEL_XP = 100;

export const decorRewards = ["yarn-ball", "cat-pillow", "sunny-rug", "fish-bowl", "window-plant"];

export function pickDecorReward(sessionNumber: number): string {
  return decorRewards[sessionNumber % decorRewards.length];
}

export function applySessionReward(profile: Profile, reward: SessionReward): Profile {
  let next = addItem(profile, reward.decorItemId);
  const totalXp = next.xp + reward.xp;
  const gainedLevels = Math.floor(totalXp / LEVEL_XP);

  return {
    ...next,
    level: next.level + gainedLevels,
    xp: totalXp % LEVEL_XP,
    eggProgress: next.eggProgress + reward.eggProgress
  };
}
```

- [ ] **Step 6: Run tests**

Run: `npm test -- src/domain/inventory.test.ts src/domain/progression.test.ts`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/domain/profile.ts src/domain/inventory.ts src/domain/progression.ts src/domain/inventory.test.ts src/domain/progression.test.ts
git commit -m "feat: add profile inventory and progression"
```

## Task 5: Add Session And Adaptive Tutor Logic

**Files:**
- Create: `src/domain/tutor.ts`
- Create: `src/domain/session.ts`
- Create: `src/domain/session.test.ts`

- [ ] **Step 1: Write failing session tests**

Write `src/domain/session.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { createSession, handleKeyPress, handleDelay } from "./session";
import { createDefaultProfile } from "./profile";
import { keyboardLayouts } from "./keyboardLayouts";

describe("session", () => {
  it("marks a correct key press as success and advances score", () => {
    const session = createSession(createDefaultProfile("ru"), keyboardLayouts.ru, 0);
    const next = handleKeyPress(session, session.currentKey.code, 800);

    expect(next.correctCount).toBe(1);
    expect(next.catMood).toBe("happy");
    expect(next.lastEvent).toBe("correct");
  });

  it("turns a wrong key into a mistake mood and stronger hint", () => {
    const session = createSession(createDefaultProfile("ru"), keyboardLayouts.ru, 0);
    const next = handleKeyPress(session, "KeyZ", 1200);

    expect(next.mistakeCount).toBe(1);
    expect(next.catMood).toBe("mistake");
    expect(next.hintStage).toBe("row");
    expect(next.lastEvent).toBe("mistake");
  });

  it("escalates hints after delay", () => {
    const session = createSession(createDefaultProfile("ru"), keyboardLayouts.ru, 0);
    expect(handleDelay(session).hintStage).toBe("quarter");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/domain/session.test.ts`

Expected: FAIL because session and tutor modules do not exist.

- [ ] **Step 3: Implement tutor**

Write `src/domain/tutor.ts`:

```ts
import type { KeyboardLayout, KeyDefinition, Profile } from "./types";

export function chooseNextKey(profile: Profile, layout: KeyboardLayout, step: number): KeyDefinition {
  const progress = profile.layoutProgress[layout.id];
  const unlocked = layout.keys.filter((key) => progress.unlockedLetters.includes(key.letter));
  const candidates = unlocked.length > 0 ? unlocked : layout.keys.slice(0, 4);

  return [...candidates].sort((a, b) => {
    const aProgress = progress.letters[a.letter];
    const bProgress = progress.letters[b.letter];
    const aAccuracy = aProgress && aProgress.attempts > 0 ? aProgress.correct / aProgress.attempts : 0;
    const bAccuracy = bProgress && bProgress.attempts > 0 ? bProgress.correct / bProgress.attempts : 0;
    if (aAccuracy !== bAccuracy) return aAccuracy - bAccuracy;
    return a.unlockOrder - b.unlockOrder;
  })[step % candidates.length];
}

export function getDelayMs(correctCount: number, mistakeCount: number): number {
  const confidentReduction = Math.min(correctCount * 120, 900);
  const mistakeIncrease = mistakeCount * 250;
  return Math.max(1200, 3200 - confidentReduction + mistakeIncrease);
}
```

- [ ] **Step 4: Implement session reducer**

Write `src/domain/session.ts`:

```ts
import { nextHintAfterDelay, nextHintAfterMistake, softenHintAfterSuccess } from "./hints";
import { chooseNextKey, getDelayMs } from "./tutor";
import type { CatMood, HintStage, KeyboardLayout, KeyDefinition, Profile } from "./types";

export interface GameSession {
  layout: KeyboardLayout;
  currentKey: KeyDefinition;
  step: number;
  correctCount: number;
  mistakeCount: number;
  hintStage: HintStage;
  catMood: CatMood;
  lastEvent: "none" | "correct" | "mistake" | "delay";
  delayMs: number;
  startedAt: number;
}

export function createSession(profile: Profile, layout: KeyboardLayout, now: number): GameSession {
  return {
    layout,
    currentKey: chooseNextKey(profile, layout, 0),
    step: 0,
    correctCount: 0,
    mistakeCount: 0,
    hintStage: "none",
    catMood: "idle",
    lastEvent: "none",
    delayMs: getDelayMs(0, 0),
    startedAt: now
  };
}

export function handleKeyPress(session: GameSession, code: string, responseMs: number): GameSession {
  if (code !== session.currentKey.code) {
    const mistakeCount = session.mistakeCount + 1;
    return {
      ...session,
      mistakeCount,
      hintStage: nextHintAfterMistake(session.hintStage),
      catMood: "mistake",
      lastEvent: "mistake",
      delayMs: getDelayMs(session.correctCount, mistakeCount)
    };
  }

  const correctCount = session.correctCount + 1;
  const step = session.step + 1;
  return {
    ...session,
    step,
    correctCount,
    currentKey: session.layout.keys[step % session.layout.keys.length],
    hintStage: responseMs < 1400 ? softenHintAfterSuccess(session.hintStage) : session.hintStage,
    catMood: "happy",
    lastEvent: "correct",
    delayMs: getDelayMs(correctCount, session.mistakeCount)
  };
}

export function handleDelay(session: GameSession): GameSession {
  return {
    ...session,
    hintStage: nextHintAfterDelay(session.hintStage),
    catMood: "idle",
    lastEvent: "delay"
  };
}

export function isSessionComplete(session: GameSession): boolean {
  return session.correctCount >= 10;
}
```

- [ ] **Step 5: Run tests**

Run: `npm test -- src/domain/session.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/domain/tutor.ts src/domain/session.ts src/domain/session.test.ts
git commit -m "feat: add keyboard session logic"
```

## Task 6: Add Local Profile Storage

**Files:**
- Create: `src/storage/localProfileStore.ts`
- Create: `src/storage/localProfileStore.test.ts`

- [ ] **Step 1: Write failing storage tests**

Write `src/storage/localProfileStore.test.ts`:

```ts
import { beforeEach, describe, expect, it } from "vitest";
import { createDefaultProfile } from "../domain/profile";
import { loadProfile, saveProfile } from "./localProfileStore";

describe("localProfileStore", () => {
  beforeEach(() => localStorage.clear());

  it("loads a default profile when storage is empty", () => {
    expect(loadProfile()).toEqual(createDefaultProfile());
  });

  it("round-trips a saved profile", () => {
    const profile = { ...createDefaultProfile("en"), level: 3, xp: 40 };
    saveProfile(profile);
    expect(loadProfile()).toEqual(profile);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/storage/localProfileStore.test.ts`

Expected: FAIL because storage module does not exist.

- [ ] **Step 3: Implement local storage adapter**

Write `src/storage/localProfileStore.ts`:

```ts
import { createDefaultProfile } from "../domain/profile";
import type { Profile } from "../domain/types";

const STORAGE_KEY = "keycat.profile.v1";

export function loadProfile(): Profile {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return createDefaultProfile();

  try {
    return JSON.parse(raw) as Profile;
  } catch {
    return createDefaultProfile();
  }
}

export function saveProfile(profile: Profile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}
```

- [ ] **Step 4: Run tests**

Run: `npm test -- src/storage/localProfileStore.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/storage/localProfileStore.ts src/storage/localProfileStore.test.ts
git commit -m "feat: persist profile locally"
```

## Task 7: Build The Russian UI Shell

**Files:**
- Modify: `src/App.tsx`
- Create: `src/ui/LayoutSelect.tsx`
- Create: `src/ui/ProgressPanel.tsx`
- Create: `src/ui/InventoryPanel.tsx`
- Create: `src/ui/App.test.tsx`

- [ ] **Step 1: Write failing UI test**

Write `src/ui/App.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { App } from "../App";

describe("App", () => {
  it("renders Russian interface and lets the child choose a layout", async () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "КлавоКот" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Русская раскладка" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Английская раскладка" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Английская раскладка" }));

    expect(screen.getByText("Раскладка: English")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/ui/App.test.tsx`

Expected: FAIL because the UI components do not exist yet.

- [ ] **Step 3: Implement layout select and panels**

Write `src/ui/LayoutSelect.tsx`:

```tsx
import type { LayoutId } from "../domain/types";

interface LayoutSelectProps {
  selectedLayout: LayoutId;
  onSelect: (layout: LayoutId) => void;
}

export function LayoutSelect({ selectedLayout, onSelect }: LayoutSelectProps) {
  return (
    <section className="panel layout-select" aria-label="Выбор раскладки">
      <h2>Выбери раскладку</h2>
      <div className="button-row">
        <button className={selectedLayout === "ru" ? "selected" : ""} onClick={() => onSelect("ru")}>
          Русская раскладка
        </button>
        <button className={selectedLayout === "en" ? "selected" : ""} onClick={() => onSelect("en")}>
          Английская раскладка
        </button>
      </div>
    </section>
  );
}
```

Write `src/ui/ProgressPanel.tsx`:

```tsx
import type { KeyboardLayout, Profile } from "../domain/types";

interface ProgressPanelProps {
  profile: Profile;
  layout: KeyboardLayout;
}

export function ProgressPanel({ profile, layout }: ProgressPanelProps) {
  return (
    <aside className="panel progress-panel">
      <strong>Уровень {profile.level}</strong>
      <span>Опыт: {profile.xp}/100</span>
      <span>Раскладка: {layout.label}</span>
      <span>Яйцо: {profile.eggProgress}/5</span>
    </aside>
  );
}
```

Write `src/ui/InventoryPanel.tsx`:

```tsx
import type { InventoryStack } from "../domain/types";

interface InventoryPanelProps {
  inventory: InventoryStack[];
}

export function InventoryPanel({ inventory }: InventoryPanelProps) {
  return (
    <section className="panel inventory-panel">
      <h2>Сундук декора</h2>
      {inventory.length === 0 ? (
        <p>Пока пусто. Котики скоро найдут первые украшения.</p>
      ) : (
        <ul>
          {inventory.map((item) => (
            <li key={item.itemId}>
              <span>{item.itemId}</span>
              <b>x{item.count}</b>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
```

- [ ] **Step 4: Wire App state**

Replace `src/App.tsx`:

```tsx
import { useMemo, useState } from "react";
import { keyboardLayouts } from "./domain/keyboardLayouts";
import { createDefaultProfile } from "./domain/profile";
import type { LayoutId, Profile } from "./domain/types";
import { InventoryPanel } from "./ui/InventoryPanel";
import { LayoutSelect } from "./ui/LayoutSelect";
import { ProgressPanel } from "./ui/ProgressPanel";

export function App() {
  const [profile, setProfile] = useState<Profile>(() => createDefaultProfile());
  const layout = useMemo(() => keyboardLayouts[profile.selectedLayout], [profile.selectedLayout]);

  function selectLayout(selectedLayout: LayoutId) {
    setProfile((current) => ({ ...current, selectedLayout }));
  }

  return (
    <main className="app-shell">
      <header className="game-header">
        <h1>КлавоКот</h1>
        <p>Нажимай буквы на клавиатуре и помогай котикам обустроить дом.</p>
      </header>
      <LayoutSelect selectedLayout={profile.selectedLayout} onSelect={selectLayout} />
      <ProgressPanel profile={profile} layout={layout} />
      <InventoryPanel inventory={profile.inventory} />
    </main>
  );
}
```

- [ ] **Step 5: Extend CSS**

Append to `src/styles.css`:

```css
.game-header {
  max-width: 1120px;
  margin: 0 auto 16px;
}

.game-header h1 {
  margin: 0;
  font-size: 44px;
}

.game-header p {
  margin: 4px 0 0;
  font-size: 18px;
}

.panel {
  max-width: 1120px;
  margin: 12px auto;
  padding: 16px;
  border: 2px solid #171313;
  border-radius: 8px;
  background: #fffaf0;
  box-shadow: 3px 3px 0 #171313;
}

.button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.button-row button {
  min-height: 44px;
  padding: 10px 16px;
  border: 2px solid #171313;
  border-radius: 8px;
  background: #f7c85f;
  cursor: pointer;
}

.button-row button.selected {
  background: #87c8ee;
}

.progress-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.inventory-panel ul {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 8px;
  padding: 0;
  list-style: none;
}

.inventory-panel li {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border: 2px solid #171313;
  border-radius: 8px;
  background: #f6d9e8;
}
```

- [ ] **Step 6: Run tests**

Run: `npm test -- src/ui/App.test.tsx`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx src/styles.css src/ui/LayoutSelect.tsx src/ui/ProgressPanel.tsx src/ui/InventoryPanel.tsx src/ui/App.test.tsx
git commit -m "feat: add russian ui shell"
```

## Task 8: Build Room Scene, Mini Keyboard, And Gameplay Screen

**Files:**
- Create: `src/ui/RoomScene.tsx`
- Create: `src/ui/MiniKeyboard.tsx`
- Create: `src/ui/GameScreen.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`
- Create: `src/ui/GameScreen.test.tsx`

- [ ] **Step 1: Write failing gameplay component test**

Write `src/ui/GameScreen.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { createSession } from "../domain/session";
import { createDefaultProfile } from "../domain/profile";
import { keyboardLayouts } from "../domain/keyboardLayouts";
import { GameScreen } from "./GameScreen";

describe("GameScreen", () => {
  it("shows the active letter and reacts to wrong keyboard input", async () => {
    const profile = createDefaultProfile("ru");
    const layout = keyboardLayouts.ru;
    const session = createSession(profile, layout, 0);
    const onSessionChange = vi.fn();

    render(<GameScreen session={session} onSessionChange={onSessionChange} onFinish={vi.fn()} />);

    expect(screen.getByText(session.currentKey.display)).toBeInTheDocument();

    await userEvent.keyboard("{KeyZ}");

    expect(onSessionChange).toHaveBeenCalledWith(expect.objectContaining({ lastEvent: "mistake" }));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/ui/GameScreen.test.tsx`

Expected: FAIL because gameplay UI files do not exist.

- [ ] **Step 3: Implement room and mini keyboard**

Write `src/ui/RoomScene.tsx`:

```tsx
import type { CatMood, KeyDefinition } from "../domain/types";

interface RoomSceneProps {
  currentKey: KeyDefinition;
  catMood: CatMood;
}

export function RoomScene({ currentKey, catMood }: RoomSceneProps) {
  return (
    <section className="room-scene" aria-label="Комната котика">
      <div className="room-wall">
        <div className="window">☀</div>
        <div className="shelf">▭ ▭ ▭</div>
      </div>
      <div className="letter-object">
        <span>{currentKey.display}</span>
      </div>
      <div className={`cat cat-${catMood}`} aria-label={catMood === "mistake" ? "Котик ошибся" : "Котик"}>
        <div className="cat-ear left" />
        <div className="cat-ear right" />
        <div className="cat-face">
          <span className="eye">•</span>
          <span className="eye">•</span>
          {catMood === "mistake" && <span className="tear" aria-label="Слезинка" />}
          <span className="mouth">{catMood === "happy" ? "ᴗ" : "⌣"}</span>
        </div>
      </div>
    </section>
  );
}
```

Write `src/ui/MiniKeyboard.tsx`:

```tsx
import { getHintForStage } from "../domain/hints";
import type { HintStage, KeyboardLayout } from "../domain/types";

interface MiniKeyboardProps {
  layout: KeyboardLayout;
  currentLetter: string;
  hintStage: HintStage;
}

export function MiniKeyboard({ layout, currentLetter, hintStage }: MiniKeyboardProps) {
  const currentKey = layout.keys.find((key) => key.letter === currentLetter)!;
  const hint = getHintForStage(currentKey, hintStage);

  return (
    <section className="mini-keyboard" aria-label="Подсказка клавиатуры">
      {["top", "home", "bottom"].map((row) => (
        <div className="keyboard-row" key={row}>
          {layout.keys
            .filter((key) => key.row === row)
            .map((key) => {
              const highlighted =
                (hint.stage === "quarter" && key.quarter === hint.quarter) ||
                (hint.stage === "row" && key.row === hint.row) ||
                (hint.stage === "key" && key.code === hint.code);
              return (
                <span className={highlighted ? "keycap highlighted" : "keycap"} key={key.code}>
                  {key.display}
                </span>
              );
            })}
        </div>
      ))}
    </section>
  );
}
```

- [ ] **Step 4: Implement game screen**

Write `src/ui/GameScreen.tsx`:

```tsx
import { useEffect, useRef } from "react";
import { handleDelay, handleKeyPress, isSessionComplete, type GameSession } from "../domain/session";
import { MiniKeyboard } from "./MiniKeyboard";
import { RoomScene } from "./RoomScene";

interface GameScreenProps {
  session: GameSession;
  onSessionChange: (session: GameSession) => void;
  onFinish: (session: GameSession) => void;
}

export function GameScreen({ session, onSessionChange, onFinish }: GameScreenProps) {
  const shownAt = useRef(performance.now());

  useEffect(() => {
    shownAt.current = performance.now();
    const delayTimer = window.setTimeout(() => onSessionChange(handleDelay(session)), session.delayMs);
    return () => window.clearTimeout(delayTimer);
  }, [session.currentKey.code, session.delayMs, onSessionChange, session]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const responseMs = performance.now() - shownAt.current;
      const next = handleKeyPress(session, event.code, responseMs);
      if (isSessionComplete(next)) {
        onFinish(next);
      } else {
        onSessionChange(next);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [session, onSessionChange, onFinish]);

  return (
    <section className="game-screen">
      <RoomScene currentKey={session.currentKey} catMood={session.catMood} />
      <MiniKeyboard
        layout={session.layout}
        currentLetter={session.currentKey.letter}
        hintStage={session.hintStage}
      />
      <div className="session-stats">
        <span>Верно: {session.correctCount}/10</span>
        <span>Ошибки: {session.mistakeCount}</span>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Wire GameScreen into App**

Update `src/App.tsx` to create and display a session:

```tsx
import { useMemo, useState } from "react";
import { keyboardLayouts } from "./domain/keyboardLayouts";
import { createDefaultProfile } from "./domain/profile";
import { applySessionReward, pickDecorReward } from "./domain/progression";
import { createSession, type GameSession } from "./domain/session";
import type { LayoutId, Profile } from "./domain/types";
import { GameScreen } from "./ui/GameScreen";
import { InventoryPanel } from "./ui/InventoryPanel";
import { LayoutSelect } from "./ui/LayoutSelect";
import { ProgressPanel } from "./ui/ProgressPanel";

export function App() {
  const [profile, setProfile] = useState<Profile>(() => createDefaultProfile());
  const layout = useMemo(() => keyboardLayouts[profile.selectedLayout], [profile.selectedLayout]);
  const [session, setSession] = useState<GameSession>(() => createSession(profile, layout, Date.now()));

  function selectLayout(selectedLayout: LayoutId) {
    setProfile((current) => ({ ...current, selectedLayout }));
    setSession(createSession({ ...profile, selectedLayout }, keyboardLayouts[selectedLayout], Date.now()));
  }

  function finishSession(doneSession: GameSession) {
    const reward = {
      xp: Math.max(25, 60 - doneSession.mistakeCount * 4),
      decorItemId: pickDecorReward(profile.inventory.length),
      eggProgress: 1
    };
    const nextProfile = applySessionReward(profile, reward);
    setProfile(nextProfile);
    setSession(createSession(nextProfile, keyboardLayouts[nextProfile.selectedLayout], Date.now()));
  }

  return (
    <main className="app-shell">
      <header className="game-header">
        <h1>КлавоКот</h1>
        <p>Нажимай буквы на клавиатуре и помогай котикам обустроить дом.</p>
      </header>
      <LayoutSelect selectedLayout={profile.selectedLayout} onSelect={selectLayout} />
      <ProgressPanel profile={profile} layout={layout} />
      <GameScreen session={session} onSessionChange={setSession} onFinish={finishSession} />
      <InventoryPanel inventory={profile.inventory} />
    </main>
  );
}
```

- [ ] **Step 6: Add gameplay CSS**

Append to `src/styles.css`:

```css
.game-screen {
  max-width: 1120px;
  margin: 12px auto;
}

.room-scene {
  position: relative;
  min-height: 360px;
  overflow: hidden;
  border: 3px solid #171313;
  border-radius: 8px;
  background: linear-gradient(#ffe6b0 0 62%, #d9a86c 62% 100%);
  box-shadow: 4px 4px 0 #171313;
}

.room-wall {
  position: absolute;
  inset: 0 0 38% 0;
}

.window,
.shelf,
.letter-object,
.cat {
  border: 2px solid #171313;
  box-shadow: 2px 2px 0 #171313;
}

.window {
  position: absolute;
  top: 28px;
  right: 64px;
  width: 110px;
  height: 90px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: #87c8ee;
  font-size: 42px;
}

.shelf {
  position: absolute;
  top: 76px;
  left: 48px;
  padding: 10px 18px;
  border-radius: 8px;
  background: #c48755;
}

.letter-object {
  position: absolute;
  left: 48%;
  bottom: 84px;
  width: 92px;
  height: 92px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #f59cab;
  animation: bob 1.4s ease-in-out infinite;
}

.letter-object span {
  font-size: 48px;
  font-weight: 800;
}

.cat {
  position: absolute;
  left: 20%;
  bottom: 52px;
  width: 128px;
  height: 96px;
  border-radius: 46% 46% 36% 36%;
  background: #f6d09a;
}

.cat-ear {
  position: absolute;
  top: -24px;
  width: 40px;
  height: 40px;
  border: 2px solid #171313;
  background: #f6d09a;
  transform: rotate(45deg);
}

.cat-ear.left {
  left: 18px;
}

.cat-ear.right {
  right: 18px;
}

.cat-face {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: center;
  padding-top: 26px;
  font-size: 28px;
}

.mouth {
  grid-column: 1 / -1;
}

.cat-happy {
  animation: bounce 0.5s ease;
}

.cat-mistake {
  background: #f2c6a0;
}

.tear {
  position: absolute;
  top: 48px;
  left: 42px;
  width: 10px;
  height: 16px;
  border: 2px solid #171313;
  border-radius: 50%;
  background: #87c8ee;
}

.mini-keyboard {
  margin-top: 12px;
  padding: 12px;
  border: 2px solid #171313;
  border-radius: 8px;
  background: #fffaf0;
  box-shadow: 3px 3px 0 #171313;
}

.keyboard-row {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin: 6px 0;
}

.keycap {
  min-width: 38px;
  min-height: 34px;
  display: grid;
  place-items: center;
  border: 2px solid #171313;
  border-radius: 6px;
  background: #ffffff;
  font-weight: 800;
}

.keycap.highlighted {
  background: #f7c85f;
}

.session-stats {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 10px;
  font-weight: 800;
}

@keyframes bob {
  50% {
    transform: translateY(-8px);
  }
}

@keyframes bounce {
  50% {
    transform: translateY(-10px);
  }
}
```

- [ ] **Step 7: Run tests**

Run: `npm test -- src/ui/GameScreen.test.tsx src/ui/App.test.tsx`

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add src/App.tsx src/styles.css src/ui/RoomScene.tsx src/ui/MiniKeyboard.tsx src/ui/GameScreen.tsx src/ui/GameScreen.test.tsx
git commit -m "feat: add playable room session"
```

## Task 9: Add Reward Screen And Local Save

**Files:**
- Modify: `src/App.tsx`
- Create: `src/ui/RewardScreen.tsx`
- Create: `src/ui/RewardScreen.test.tsx`

- [ ] **Step 1: Write failing reward screen test**

Write `src/ui/RewardScreen.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RewardScreen } from "./RewardScreen";

describe("RewardScreen", () => {
  it("shows Russian reward text and continues", async () => {
    const onContinue = vi.fn();
    render(<RewardScreen xp={48} decorItemId="sunny-rug" eggProgress={2} onContinue={onContinue} />);

    expect(screen.getByRole("heading", { name: "Награда!" })).toBeInTheDocument();
    expect(screen.getByText("Опыт: +48")).toBeInTheDocument();
    expect(screen.getByText("Новый декор: sunny-rug")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Играть дальше" }));
    expect(onContinue).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/ui/RewardScreen.test.tsx`

Expected: FAIL because `RewardScreen` does not exist.

- [ ] **Step 3: Implement RewardScreen**

Write `src/ui/RewardScreen.tsx`:

```tsx
interface RewardScreenProps {
  xp: number;
  decorItemId: string;
  eggProgress: number;
  onContinue: () => void;
}

export function RewardScreen({ xp, decorItemId, eggProgress, onContinue }: RewardScreenProps) {
  return (
    <section className="panel reward-screen">
      <h2>Награда!</h2>
      <p>Котики стали увереннее находить буквы.</p>
      <ul>
        <li>Опыт: +{xp}</li>
        <li>Новый декор: {decorItemId}</li>
        <li>Яйцо: +{eggProgress}</li>
      </ul>
      <button onClick={onContinue}>Играть дальше</button>
    </section>
  );
}
```

- [ ] **Step 4: Wire reward state and local save in App**

Update `src/App.tsx`:

```tsx
import { useEffect, useMemo, useState } from "react";
import { keyboardLayouts } from "./domain/keyboardLayouts";
import { createDefaultProfile } from "./domain/profile";
import { applySessionReward, pickDecorReward, type SessionReward } from "./domain/progression";
import { createSession, type GameSession } from "./domain/session";
import type { LayoutId, Profile } from "./domain/types";
import { loadProfile, saveProfile } from "./storage/localProfileStore";
import { GameScreen } from "./ui/GameScreen";
import { InventoryPanel } from "./ui/InventoryPanel";
import { LayoutSelect } from "./ui/LayoutSelect";
import { ProgressPanel } from "./ui/ProgressPanel";
import { RewardScreen } from "./ui/RewardScreen";

export function App() {
  const [profile, setProfile] = useState<Profile>(() => loadProfile());
  const layout = useMemo(() => keyboardLayouts[profile.selectedLayout], [profile.selectedLayout]);
  const [session, setSession] = useState<GameSession>(() => createSession(profile, layout, Date.now()));
  const [lastReward, setLastReward] = useState<SessionReward | null>(null);

  useEffect(() => {
    saveProfile(profile);
  }, [profile]);

  function selectLayout(selectedLayout: LayoutId) {
    const nextProfile = { ...profile, selectedLayout };
    setProfile(nextProfile);
    setSession(createSession(nextProfile, keyboardLayouts[selectedLayout], Date.now()));
  }

  function finishSession(doneSession: GameSession) {
    const reward = {
      xp: Math.max(25, 60 - doneSession.mistakeCount * 4),
      decorItemId: pickDecorReward(profile.inventory.length),
      eggProgress: 1
    };
    const nextProfile = applySessionReward(profile, reward);
    setProfile(nextProfile);
    setLastReward(reward);
  }

  function continueAfterReward() {
    setLastReward(null);
    setSession(createSession(profile, keyboardLayouts[profile.selectedLayout], Date.now()));
  }

  return (
    <main className="app-shell">
      <header className="game-header">
        <h1>КлавоКот</h1>
        <p>Нажимай буквы на клавиатуре и помогай котикам обустроить дом.</p>
      </header>
      <LayoutSelect selectedLayout={profile.selectedLayout} onSelect={selectLayout} />
      <ProgressPanel profile={profile} layout={layout} />
      {lastReward ? (
        <RewardScreen
          xp={lastReward.xp}
          decorItemId={lastReward.decorItemId}
          eggProgress={lastReward.eggProgress}
          onContinue={continueAfterReward}
        />
      ) : (
        <GameScreen session={session} onSessionChange={setSession} onFinish={finishSession} />
      )}
      <InventoryPanel inventory={profile.inventory} />
    </main>
  );
}
```

- [ ] **Step 5: Add reward CSS**

Append to `src/styles.css`:

```css
.reward-screen {
  text-align: center;
}

.reward-screen ul {
  display: inline-grid;
  gap: 8px;
  padding: 0;
  list-style: none;
  text-align: left;
}

.reward-screen button {
  display: block;
  margin: 14px auto 0;
  min-height: 44px;
  padding: 10px 18px;
  border: 2px solid #171313;
  border-radius: 8px;
  background: #87c8ee;
  cursor: pointer;
}
```

- [ ] **Step 6: Run tests**

Run: `npm test -- src/ui/RewardScreen.test.tsx src/storage/localProfileStore.test.ts src/ui/App.test.tsx`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add src/App.tsx src/styles.css src/ui/RewardScreen.tsx src/ui/RewardScreen.test.tsx
git commit -m "feat: add rewards and local save"
```

## Task 10: Final Verification And Push

**Files:**
- Modify only if verification finds issues.

- [ ] **Step 1: Run all tests**

Run: `npm test`

Expected: all tests PASS.

- [ ] **Step 2: Build production bundle**

Run: `npm run build`

Expected: TypeScript and Vite build PASS.

- [ ] **Step 3: Start local dev server**

Run: `npm run dev -- --host 127.0.0.1`

Expected: Vite prints a local URL, usually `http://127.0.0.1:5173/`.

- [ ] **Step 4: Browser smoke test**

Open the local URL and verify:

- The interface text is in Russian.
- Layout buttons switch between Russian and English.
- A letter appears on the room object.
- Pressing the correct physical key makes the cat happy and advances progress.
- Pressing the wrong physical key shows the brief tear reaction and escalates the hint.
- Waiting escalates hints from quarter to row to key.
- Completing 10 correct letters shows a reward screen.
- Rewarded decor appears in the inventory with stack counts.
- Refreshing the page keeps profile progress.

- [ ] **Step 5: Commit any verification fixes**

If fixes were required:

```bash
git add src
git commit -m "fix: polish mvp verification issues"
```

If no fixes were required, skip this step.

- [ ] **Step 6: Push**

Run: `git push`

Expected: local `main` pushes to `origin/main`.

## Self-Review Notes

Spec coverage:

- Russian interface: Task 1, Task 7, Task 9.
- Russian and English layout choice: Task 2, Task 7.
- Independent progress data per layout: Task 2, Task 4.
- Letter objects and physical keyboard input: Task 5, Task 8.
- Staged hints: Task 3, Task 8.
- Cat success and mistake reactions with tear: Task 5, Task 8.
- Short session and reward summary: Task 5, Task 9.
- XP, egg progress, decor reward: Task 4, Task 9.
- Inventory with stacked duplicates: Task 4, Task 7.
- Local storage: Task 6, Task 9.
- Thin black cartoon outlines: Task 1, Task 7, Task 8, Task 9.
- Testing and verification: every task plus Task 10.

Known deliberate MVP limits:

- Only one room is implemented.
- Eggs progress exists, but full egg opening and animal rarity draw are deferred.
- Animals beyond the main cat are deferred.
- Parent settings are deferred except for data architecture readiness.
- Production-quality art is represented by CSS cartoon shapes, not final assets.
