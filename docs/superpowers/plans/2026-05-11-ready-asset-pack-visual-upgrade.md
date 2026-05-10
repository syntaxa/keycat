# Ready Asset Pack Visual Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current CSS primitive room art with a first ready-asset-pack visual layer using ToffeeCraft Pet Mobile Pixel Asset Pack as the primary candidate.

**Architecture:** Keep gameplay/domain logic unchanged and add a small UI asset registry that maps cat moods, room layers, and decor item ids to imported image files. `RoomScene` becomes an asset composition component with letter overlay, while CSS handles responsive placement and pixel-art rendering.

**Tech Stack:** Vite, React, TypeScript, Vitest, Testing Library, CSS, local static image assets.

---

## File Structure

- Create: `src/assets/README.md` - documents where external asset packs are expected, what is committed, and license handling.
- Create: `src/ui/artAssets.ts` - project-facing registry for room, cat, toy, and decor image paths.
- Modify: `src/ui/RoomScene.tsx` - renders image-based room/cat/letter toy using `artAssets`.
- Modify: `src/ui/InventoryPanel.tsx` - shows decor icons when a mapped asset exists.
- Modify: `src/styles.css` - replaces CSS primitive scene styling with asset-layer styling and pixel-art rendering.
- Modify: `src/ui/GameScreen.test.tsx` - verifies asset-based cat states preserve gameplay interaction.
- Create or modify: `src/ui/RoomScene.test.tsx` - verifies `RoomScene` renders current letter and cat state asset.
- Modify: `src/ui/App.test.tsx` - verifies app still renders after asset registry is introduced.

## Asset Acquisition Rule

This plan cannot assume the paid/downloaded pack is already present. Before code integration, inspect local files:

- Expected primary source directory: `src/assets/vendor/toffeecraft-pet-mobile/`
- The itch.io page lists `PetMobileFree.zip` as a free download and `PetMobileGameAsset.zip` as available when paying `$1.80 USD` or more.
- If absent, stop and ask the user to provide the pack archive or extracted folder.
- If present, inspect filenames and choose the closest room background, cat idle/happy/mistake frames, toy object, and decor icons.
- Do not commit a downloaded archive file. Commit only curated images needed by the app if the license permits repository storage.

## Task 1: Document Asset Intake And Expected Folders

**Files:**
- Create: `src/assets/README.md`
- Create directories if assets are available later: `src/assets/vendor/`, `src/assets/game/room/`, `src/assets/game/cats/`, `src/assets/game/decor/`

- [ ] **Step 1: Create asset documentation**

Write `src/assets/README.md`:

```md
# Keycat Assets

This directory contains project-facing game art and optional vendor source art.

## Selected Pack

Primary candidate: ToffeeCraft Pet Mobile Pixel Asset Pack
URL: https://toffeecraft.itch.io/pet-virtual-mobile-pixel-asset

Backup candidates:
- https://toffeecraft.itch.io/cat-room
- https://toffeecraft.itch.io/cat-retro

## Directory Layout

- `vendor/`: extracted third-party packs for local inspection. Do not commit paid archives.
- `game/room/`: curated room backgrounds and room props used by Keycat.
- `game/cats/`: curated cat state sprites used by Keycat.
- `game/decor/`: curated decor icons used by inventory and rewards.

## Rules

- Confirm the pack license before committing any third-party image.
- Commit only the minimal curated files used by the game.
- Keep original archives out of git.
- Preserve attribution notes here when required by the license.
```

- [ ] **Step 2: Verify documentation exists**

Run: `Test-Path src/assets/README.md`

Expected: `True`.

- [ ] **Step 3: Commit**

```bash
git add src/assets/README.md
git commit -m "docs: document visual asset intake"
```

## Task 2: Inspect Pack Availability

**Files:**
- Read: `src/assets/vendor/toffeecraft-pet-mobile/`
- Optionally create curated image files under `src/assets/game/`

- [ ] **Step 1: Check for the selected asset pack**

Run:

```powershell
Test-Path src/assets/vendor/toffeecraft-pet-mobile
```

Expected:

- If `True`, continue to Step 2.
- If `False`, stop and ask the user to provide the extracted ToffeeCraft Pet Mobile Pixel Asset Pack at `src/assets/vendor/toffeecraft-pet-mobile/`.

- [ ] **Step 2: List candidate image files**

Run:

```powershell
Get-ChildItem -Path src/assets/vendor/toffeecraft-pet-mobile -Recurse -File |
  Where-Object { $_.Extension -match '\.(png|webp|jpg|jpeg)$' } |
  Select-Object -First 80 -ExpandProperty FullName
```

Expected: a list of image files including room/background, furniture, pet/cat, and decor sprites.

- [ ] **Step 3: Curate first-pass files**

Copy the chosen files into project-facing paths:

```text
src/assets/game/room/first-room.png
src/assets/game/cats/cat-idle.png
src/assets/game/cats/cat-happy.png
src/assets/game/cats/cat-mistake.png
src/assets/game/decor/yarn-ball.png
src/assets/game/decor/cat-pillow.png
src/assets/game/decor/sunny-rug.png
src/assets/game/decor/fish-bowl.png
src/assets/game/decor/window-plant.png
```

If the pack uses spritesheets rather than individual images, crop or select a representative frame before copying. Keep filenames exactly as listed so later tasks can use stable imports.

- [ ] **Step 4: Commit curated assets**

```bash
git add src/assets/game src/assets/README.md
git commit -m "feat: add first curated visual assets"
```

## Task 3: Add UI Asset Registry

**Files:**
- Create: `src/ui/artAssets.ts`
- Create: `src/ui/artAssets.test.ts`

- [ ] **Step 1: Write failing registry test**

Write `src/ui/artAssets.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { catMoodAssets, decorIconAssets, roomAssets } from "./artAssets";

describe("artAssets", () => {
  it("maps the first room and all cat moods to image assets", () => {
    expect(roomAssets.firstRoom).toContain("first-room");
    expect(catMoodAssets.idle).toContain("cat-idle");
    expect(catMoodAssets.happy).toContain("cat-happy");
    expect(catMoodAssets.mistake).toContain("cat-mistake");
  });

  it("maps known reward decor ids to image assets", () => {
    expect(decorIconAssets["yarn-ball"]).toContain("yarn-ball");
    expect(decorIconAssets["cat-pillow"]).toContain("cat-pillow");
    expect(decorIconAssets["sunny-rug"]).toContain("sunny-rug");
    expect(decorIconAssets["fish-bowl"]).toContain("fish-bowl");
    expect(decorIconAssets["window-plant"]).toContain("window-plant");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/ui/artAssets.test.ts`

Expected: FAIL because `src/ui/artAssets.ts` does not exist.

- [ ] **Step 3: Implement registry**

Write `src/ui/artAssets.ts`:

```ts
import firstRoom from "../assets/game/room/first-room.png";
import catHappy from "../assets/game/cats/cat-happy.png";
import catIdle from "../assets/game/cats/cat-idle.png";
import catMistake from "../assets/game/cats/cat-mistake.png";
import catPillow from "../assets/game/decor/cat-pillow.png";
import fishBowl from "../assets/game/decor/fish-bowl.png";
import sunnyRug from "../assets/game/decor/sunny-rug.png";
import windowPlant from "../assets/game/decor/window-plant.png";
import yarnBall from "../assets/game/decor/yarn-ball.png";
import type { CatMood } from "../domain/types";

export const roomAssets = {
  firstRoom
};

export const catMoodAssets: Record<CatMood, string> = {
  idle: catIdle,
  happy: catHappy,
  mistake: catMistake
};

export const decorIconAssets: Record<string, string> = {
  "yarn-ball": yarnBall,
  "cat-pillow": catPillow,
  "sunny-rug": sunnyRug,
  "fish-bowl": fishBowl,
  "window-plant": windowPlant
};
```

- [ ] **Step 4: Run registry test**

Run: `npm test -- src/ui/artAssets.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/ui/artAssets.ts src/ui/artAssets.test.ts
git commit -m "feat: add visual asset registry"
```

## Task 4: Render Asset-Based Room Scene

**Files:**
- Modify: `src/ui/RoomScene.tsx`
- Create: `src/ui/RoomScene.test.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Write failing RoomScene tests**

Write `src/ui/RoomScene.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { keyboardLayouts } from "../domain/keyboardLayouts";
import { RoomScene } from "./RoomScene";

const letterA = keyboardLayouts.ru.keys.find((key) => key.letter === "а")!;

describe("RoomScene", () => {
  it("renders the current letter as an accessible letter object", () => {
    render(<RoomScene currentKey={letterA} catMood="idle" />);

    expect(screen.getByLabelText("Буква А")).toBeInTheDocument();
    expect(screen.getByText("А")).toBeInTheDocument();
  });

  it("renders an image for the current cat mood", () => {
    render(<RoomScene currentKey={letterA} catMood="mistake" />);

    const cat = screen.getByRole("img", { name: "Котик ошибся" });
    expect(cat).toHaveAttribute("src", expect.stringContaining("cat-mistake"));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/ui/RoomScene.test.tsx`

Expected: FAIL because `RoomScene` still renders CSS shapes, not mood images.

- [ ] **Step 3: Implement image-based RoomScene**

Replace `src/ui/RoomScene.tsx` with:

```tsx
import type { CatMood, KeyDefinition } from "../domain/types";
import { catMoodAssets, roomAssets } from "./artAssets";

interface RoomSceneProps {
  currentKey: KeyDefinition;
  catMood: CatMood;
}

export function RoomScene({ currentKey, catMood }: RoomSceneProps) {
  const mistake = catMood === "mistake";

  return (
    <section className="room-scene room-scene-assets" aria-label="Комната котика">
      <img className="room-background" src={roomAssets.firstRoom} alt="" aria-hidden="true" />
      <img
        className={`asset-cat asset-cat-${catMood}`}
        src={catMoodAssets[catMood]}
        alt={mistake ? "Котик ошибся" : "Котик"}
      />
      <div className="asset-letter-object" aria-label={`Буква ${currentKey.display}`}>
        <span>{currentKey.display}</span>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Replace primitive room CSS**

In `src/styles.css`, keep `.room-scene` sizing, then replace old `.room-wall`, `.window`, `.shelf`, `.letter-object`, `.cat`, `.cat-ear`, `.cat-face`, `.eye`, `.mouth`, `.tear`, `.cat-happy`, and `.cat-mistake` visual blocks with:

```css
.room-scene-assets {
  min-height: 420px;
  background: #171313;
  image-rendering: pixelated;
}

.room-background {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  image-rendering: pixelated;
}

.asset-cat {
  position: absolute;
  left: 13%;
  bottom: 12%;
  width: min(22vw, 180px);
  min-width: 112px;
  height: auto;
  image-rendering: pixelated;
  filter: drop-shadow(4px 6px 0 rgba(23, 19, 19, 0.22));
}

.asset-cat-happy {
  animation: bounce 0.5s ease;
}

.asset-cat-mistake {
  transform: translateY(2px);
}

.asset-letter-object {
  position: absolute;
  right: 18%;
  bottom: 25%;
  width: clamp(72px, 13vw, 118px);
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  border: 3px solid #171313;
  border-radius: 50%;
  background: #f59cab;
  box-shadow: 4px 5px 0 rgba(23, 19, 19, 0.28);
  animation: bob 1.4s ease-in-out infinite;
}

.asset-letter-object span {
  font-size: clamp(38px, 7vw, 66px);
  font-weight: 900;
  line-height: 1;
}
```

Update the mobile media block to use `.asset-cat` and `.asset-letter-object`:

```css
  .asset-cat {
    left: 7%;
    width: 116px;
  }

  .asset-letter-object {
    right: 24px;
    bottom: 30%;
  }
```

- [ ] **Step 5: Run RoomScene test**

Run: `npm test -- src/ui/RoomScene.test.tsx src/ui/GameScreen.test.tsx`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/ui/RoomScene.tsx src/ui/RoomScene.test.tsx src/styles.css
git commit -m "feat: render asset-based room scene"
```

## Task 5: Add Inventory Icons From Asset Registry

**Files:**
- Modify: `src/ui/InventoryPanel.tsx`
- Modify: `src/styles.css`
- Modify: `src/ui/App.test.tsx`

- [ ] **Step 1: Write failing inventory icon test**

Update `src/ui/App.test.tsx` or create `src/ui/InventoryPanel.test.tsx` with:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { InventoryPanel } from "./InventoryPanel";

describe("InventoryPanel", () => {
  it("renders an icon for known decor stacks", () => {
    render(
      <InventoryPanel
        inventory={[{ itemId: "cat-pillow", count: 2, isNew: true, favorite: false }]}
      />
    );

    expect(screen.getByRole("img", { name: "cat-pillow" })).toHaveAttribute(
      "src",
      expect.stringContaining("cat-pillow")
    );
    expect(screen.getByText("x2")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- src/ui/InventoryPanel.test.tsx`

Expected: FAIL because inventory icons are not rendered.

- [ ] **Step 3: Implement inventory icons**

Update `src/ui/InventoryPanel.tsx` to import `decorIconAssets` and render known icons:

```tsx
import type { InventoryStack } from "../domain/types";
import { decorIconAssets } from "./artAssets";

interface InventoryPanelProps {
  inventory: InventoryStack[];
}

export function InventoryPanel({ inventory }: InventoryPanelProps) {
  return (
    <section className="panel inventory-panel" aria-label="Инвентарь">
      <h2>Инвентарь</h2>
      {inventory.length === 0 ? (
        <p className="empty-state">Пока нет декора. Заверши урок, чтобы получить награду.</p>
      ) : (
        <ul className="inventory-list">
          {inventory.map((item) => {
            const icon = decorIconAssets[item.itemId];
            return (
              <li className="inventory-stack" key={item.itemId}>
                {icon && <img className="inventory-icon" src={icon} alt={item.itemId} />}
                <span className="item-name">{item.itemId}</span>
                <span className="item-count">x{item.count}</span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
```

- [ ] **Step 4: Add icon CSS**

Append to `src/styles.css`:

```css
.inventory-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
  image-rendering: pixelated;
}
```

- [ ] **Step 5: Run inventory test**

Run: `npm test -- src/ui/InventoryPanel.test.tsx src/ui/App.test.tsx`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/ui/InventoryPanel.tsx src/ui/InventoryPanel.test.tsx src/styles.css
git commit -m "feat: show decor asset icons in inventory"
```

## Task 6: Final Verification

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

Expected: Vite serves the app at `http://127.0.0.1:5173/`.

- [ ] **Step 4: Browser smoke test**

Open the app and verify:

- The room uses asset images rather than CSS primitive shapes.
- The active letter remains readable.
- Correct key input shows the happy cat asset.
- Wrong key input shows the mistake/sad/cry cat asset.
- Inventory shows asset icons with stack counts.
- Mobile width keeps the cat and letter visible.

- [ ] **Step 5: Commit fixes if needed**

If verification required fixes:

```bash
git add src
git commit -m "fix: polish ready asset visual upgrade"
```

If no fixes were needed, skip this step.

## Self-Review Notes

Spec coverage:

- Primary ToffeeCraft pack first: Task 2.
- Fallback if pack unavailable: Task 2 stop condition.
- Local asset layer: Tasks 1-3.
- Asset-based RoomScene: Task 4.
- Inventory icons: Task 5.
- Letter readability: Task 4 and Task 6.
- Tests and browser verification: Tasks 3-6.

Known limits:

- This plan does not automate purchasing or downloading paid assets.
- Exact source filenames cannot be known until the pack archive is available.
- Cropping spritesheet frames may require manual or script-assisted extraction after inspection.
