# Cat Keyboard Game Design

## Goal

Create a colorful keyboard-learning game for children ages 6-8. The game helps children remember where letters are on a physical computer keyboard and gradually type faster, without requiring strict touch-typing finger technique.

The game interface is in Russian.

The game supports two selectable keyboard layouts:

- Russian layout.
- English layout.

Each layout has independent learning progress so children do not mix mastery between alphabets.

## Core Concept

Working title: **Cat Letter House**.

The player enters a cozy side-view 2D room where cats live. Later, other real animals can appear, but cats remain the main characters and have the richest presence in the game.

During short sessions, letters appear naturally on room objects such as yarn balls, boxes, pillows, toys, bowls, books, curtains, and decor pieces. The child presses the matching key on the physical keyboard. A cat then interacts with the object: catches the yarn, jumps onto the pillow, opens the box, brings a toy, or performs another short animation.

Each session should be short, roughly 1-3 minutes. The game adapts its pace:

- If the child answers confidently, objects appear faster or in short chains.
- If the child hesitates or makes mistakes, the pace slows and hints become clearer.

After sessions, the player earns experience, decor, level progress, and sometimes eggs containing animals. Over time, new home zones unlock: first room, play room, pet kitchen, window garden, bedroom, and small veranda.

## Learning Mechanics

The core learning loop is:

1. See a letter in the room.
2. Find and press the matching physical keyboard key.
3. Receive an immediate animated reaction.

Each layout has its own progress state. The game starts with a small letter set and repeats it often. New letters are added gradually based on keyboard zones and difficulty, not purely alphabet order.

The game tracks:

- Accuracy.
- Average response time.
- Difficult letters.
- Current mastered letter set.
- Progress per layout.

These metrics are used internally. The child sees friendly game feedback instead of dry statistics.

## Hint System

Hints fade over time as mastery grows. Early levels show the mini-keyboard constantly. Later levels reduce direct help, restoring it only after hesitation or mistakes.

Hints are staged:

1. If the child delays, the mini-keyboard highlights the keyboard quarter where the letter is located.
2. If the delay continues or the child makes a mistake, the row is highlighted.
3. If this still does not help, the exact key is highlighted.
4. On later repeats, the game tries weaker hints again before revealing the exact key.

The hint system must be data-driven for both Russian and English layouts. Each letter needs a key position, row, and quarter.

## Feedback For Mistakes

Mistakes are soft learning moments, not failures.

When the child presses the wrong key:

- The object stays in place.
- A small cartoon tear appears from the cat's eye as a brief reaction.
- The cat looks surprised or gently sad for about a second.
- The cat then recovers, waits, and may gesture toward the hint.
- The hint level becomes clearer.

If the child makes several mistakes, the game should not increase sadness. Instead, it slows down and provides more direct help. When the child presses the correct key afterward, the cat reacts happily.

The tear must be brief and cartoon-like, not emotionally heavy or manipulative.

## Progression

Progress has three layers.

### Home Level

Short sessions give experience. Level milestones unlock new home zones:

- First room.
- Play room.
- Pet kitchen.
- Bedroom.
- Window garden.
- Veranda.

Each zone adds fresh visual contexts and object types while preserving the same core letter-pressing mechanic.

### Decor

The child earns decor items:

- Beds and cat houses.
- Toys.
- Furniture and shelves.
- Rugs and textiles.
- Bowls and care items.
- Plants and window items.
- Decorations.
- Seasonal or special items.

Decor should not be passive only. Animals should interact with placed items so rewards feel emotionally valuable.

### Eggs And Animal Collection

Eggs are earned through achievements and milestones, such as:

- Level completion.
- Accurate answer streaks.
- Mastering a letter set.
- Returning to difficult letters.
- Finishing a weekly goal.

Eggs contain real animals with rarity tiers:

- Common.
- Uncommon.
- Rare.
- Very rare.

Cats are the main collection and should have the most variants, animations, and personalities. Other real animals can appear as guests or special residents.

Randomness must be child-safe:

- No purchases.
- No ads.
- No energy systems.
- No paid attempts.
- No pressure mechanics.
- No loss of collected rewards.

The game should include guarantees so the child eventually receives new animals and rare rewards. Duplicate animals can give care stars or calm progression for existing animals.

## Inventory

Inventory is a core part of the decoration loop, not a hidden technical storage.

Newly earned decor goes into the inventory first. The child can place it immediately or keep it for later. Placed objects can be removed back into inventory.

Inventory categories:

- Beds and houses.
- Toys.
- Furniture and shelves.
- Rugs and textiles.
- Bowls and care.
- Plants and windows.
- Decorations.
- Seasonal and special items.

Duplicate decor items stack like Minecraft item stacks:

- Each item type has an inventory slot.
- Receiving a duplicate increases the stack count.
- Placing one item decreases the stack count by 1.
- Removing a placed item increases the stack count by 1.
- Multiple identical objects can be placed if the room placement rules allow it.

Items can have states such as new, owned, placed, and favorite. New items should be visually marked.

## Visual Style

The game uses a colorful cartoon 2D style with cozy textures: fabric, wood, paper, yarn, ceramic, and soft room materials.

All visuals should use thin black outlines:

- Characters.
- Animals.
- Objects.
- Letters.
- UI panels.
- Icons.
- Decor.

The style should feel like a clear interactive cartoon or sticker illustration. It should be bright but not visually exhausting.

The game should avoid relying on a single all-pink theme. Room themes can vary:

- The first room is warm and sunny.
- The play room is brighter and more playful.
- The bedroom is softer.
- The window garden is greener.
- The kitchen is light and clean.

## Interface

During exercises, the interface stays minimal.

Main screen areas:

- A large living room scene in the center.
- A mini-keyboard at the bottom or side for staged hints.
- A small progress panel with current level, selected layout, current reward, and access to decor or collection.

The child should not need to read long instructions during play. The scene, highlighted letters, hints, and cat reactions should make the task understandable.

After each short session, the game can show a reward screen with:

- Experience gained.
- New decor or inventory progress.
- Egg progress or egg opening.
- Newly introduced letters.
- New animal or animal progression.

## System Structure

The design should stay platform-flexible so it can later become a browser or desktop application.

Core modules:

- **Game Session**: runs short exercises, spawns letter objects, accepts keyboard input, resolves success, mistake, delay, and animal reactions.
- **Keyboard Layouts**: stores Russian and English key data, including letters, positions, rows, quarters, and unlock order.
- **Adaptive Tutor**: chooses next letters and pacing based on speed, accuracy, mistakes, difficult letters, and hint history.
- **Hint System**: manages quarter, row, and exact-key hints.
- **Room & Decor**: manages rooms, placed objects, unlocked zones, and object interactions.
- **Inventory**: stores owned unplaced items, stacked duplicates, categories, new markers, and placement/removal state.
- **Animal Collection**: manages eggs, rarity, animals, duplicates, care stars, personalities, and base animations.
- **Progression**: manages experience, levels, milestones, reward tables, unlocked letters, zones, decor, and eggs.
- **Profile Storage**: saves selected layout, layout progress, collection, inventory, rooms, settings, and parent options.

Learning data and cosmetic data should remain separate. Room decoration and collection can change freely while the tutor keeps reliable independent learning progress.

## Parent Comfort And Safety

The game should be friendly and safe for children.

Parent settings can include:

- Sound on or off.
- Layout selection.
- Profile creation or reset.
- View of mastered and difficult letters.
- Calm mode with less acceleration.

The parent view should be simple and optional. The child-facing game should not feel like a school report.

All storage is local in the first design. Any online features should be designed separately later.

## Testing And Quality

Testing has three layers.

### Learning Correctness

Validate keyboard layout data:

- Every supported letter exists.
- Every letter has a position, row, and quarter.
- Hint order works correctly.
- Russian and English progress are independent.

### Game Logic

Test:

- Adaptive letter selection.
- Pace changes after success, hesitation, and mistakes.
- Inventory stacks.
- Placement and removal of decor.
- Experience and milestone rewards.
- Egg rarity and guarantee rules.
- Duplicate animal handling.
- Mistake feedback and hint escalation.

### Child Experience

Manually verify:

- Letters are easy to read.
- Thin black outlines improve clarity.
- Hints are understandable.
- The scene is not overloaded.
- Cat reactions feel lively.
- The tear on mistakes is brief and gentle.
- A child can understand the main action without lengthy instructions.

The first prototype succeeds if a child understands that they should press matching letters on the physical keyboard, notices progress, enjoys cats and decor, and wants another short session.
