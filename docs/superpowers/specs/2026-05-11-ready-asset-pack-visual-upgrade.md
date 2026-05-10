# Ready Asset Pack Visual Upgrade Spec

## Goal

Upgrade the Keycat MVP visuals by replacing the current CSS-built room and cat shapes with ready-made asset-pack art, prioritizing fast product progress over a custom illustration pipeline.

## Selected Asset Direction

The first candidate to try is **ToffeeCraft Pet Mobile Pixel Asset Pack**:

- URL: https://toffeecraft.itch.io/pet-virtual-mobile-pixel-asset
- Claimed contents: cozy room backgrounds, furniture, toys, food bowls, decorations, multiple cat types, dogs, bunnies, and pet animations.
- Acquisition note from the itch.io page: `PetMobileFree.zip` is listed as a free download, while `PetMobileGameAsset.zip` is listed as available when paying `$1.80 USD` or more.
- Fit: strong match for a pet-room game loop, even if the style is pixel art rather than the earlier Toca Boca-like target.

The backup candidate is **ToffeeCraft Cat Room + Cat Pack Pochi**:

- Cat Room: https://toffeecraft.itch.io/cat-room
- Cat Pack Pochi: https://toffeecraft.itch.io/cat-retro
- Fit: more cat-focused, with room/decor assets and cat animations including happy, cry, surprised, sleeping, and other expressive states.

## Product Scope

This phase should produce one visually upgraded playable room, not a full art migration.

The upgraded room must include:

- A ready-made room background or room assembled from the selected pack.
- One visible cat asset for idle state.
- A happy cat state after correct key input.
- A mistake/sad/cry visual state after wrong key input.
- A visible letter object that remains readable at desktop and mobile sizes.
- Inventory icons that use pack art where available.

The game can remain pixel art for this phase. Consistency matters more than matching the previous Toca Boca-style target.

## Licensing And Acquisition

Before integrating any pack files:

- Confirm the asset pack license allows use in personal and commercial game projects.
- Confirm modification/editing is allowed.
- Do not redistribute raw asset files outside the game repository/release.
- Do not commit downloaded paid archives unless the repository is private and the license permits storing working copies.
- If the selected pack requires purchase or account download, the user must obtain the archive or explicitly authorize the download/purchase path.

The selected pack page states that the free pack is for personal use, can be used and edited freely, cannot be redistributed/resold, and can be used for game development and other productions. The page states that the paid pack is for commercial or personal use, can be used and edited freely, cannot be redistributed/resold, and can be used for game development and other productions.

If the pack contents or license do not match the page claims, switch to the backup candidate rather than forcing a poor fit.

## Technical Approach

Add a local asset layer under `src/assets/` and keep imported artwork separate from domain logic.

Recommended structure:

- `src/assets/vendor/toffeecraft-pet-mobile/`: selected raw or curated asset files.
- `src/assets/game/room/`: project-facing copied/renamed room assets.
- `src/assets/game/cats/`: project-facing copied/renamed cat state assets.
- `src/assets/game/decor/`: project-facing decor and inventory icons.
- `src/ui/RoomScene.tsx`: render asset images and current letter overlay.
- `src/ui/InventoryPanel.tsx`: optionally map item ids to asset icons.

Keep the domain model unchanged unless the pack requires different item ids for display.

## Visual Requirements

- Preserve letter readability as the top priority.
- Use `image-rendering: pixelated` if the selected pack is pixel art.
- Avoid stretching sprites unevenly.
- Place the letter as an overlay on a toy/object if the pack does not include lettered objects.
- Keep the cat state transition readable: idle, happy, mistake.
- Avoid mixing unrelated asset styles in the first pass.

## Testing And Verification

Automated tests should cover:

- `RoomScene` renders the current letter label.
- `RoomScene` renders the expected cat state class or image state for idle, happy, and mistake.
- `InventoryPanel` still renders stack counts when icons are added.

Manual/browser verification should cover:

- The room is visibly asset-based, not CSS primitive art.
- Correct key input updates the cat to happy and advances the session.
- Wrong key input updates the cat to mistake/sad/cry.
- The letter is readable on the room object.
- The mini keyboard and progress UI still fit around the new scene.
- Mobile width does not crop the active letter or cat.

## Risks

- The selected pack may be top-down/mobile-oriented while Keycat's room is currently side-view.
- Pixel art may feel less like the requested Toca Boca reference, but it can still deliver a much better product visual than CSS primitives.
- Pack previews may not expose all needed states until the archive is inspected.
- Paid assets may require user action before integration.

## Decision

Proceed with **ToffeeCraft Pet Mobile Pixel Asset Pack** as the first pack to inspect and integrate. Use **ToffeeCraft Cat Room + Cat Pack Pochi** as the fallback if the first pack is unavailable, poorly licensed, or does not contain usable cat-room visuals.
