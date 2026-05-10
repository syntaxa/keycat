import { keyboardLayouts } from "./keyboardLayouts";
import type { KeyboardLayout, KeyDefinition, LayoutId, Profile } from "./types";

export function chooseNextKey(profile: Profile, layout: KeyboardLayout, step: number): KeyDefinition {
  const progress = profile.layoutProgress[layout.id];
  const unlocked = layout.keys
    .filter((key) => progress.unlockedLetters.includes(key.letter))
    .sort((a, b) => {
      const aProgress = progress.letters[a.letter] ?? { attempts: 0, correct: 0, totalResponseMs: 0, mastered: false };
      const bProgress = progress.letters[b.letter] ?? { attempts: 0, correct: 0, totalResponseMs: 0, mastered: false };
      return aProgress.correct - bProgress.correct || aProgress.attempts - bProgress.attempts || a.unlockOrder - b.unlockOrder;
    });

  const pool = unlocked.length > 0 ? unlocked : [...layout.keys].sort((a, b) => a.unlockOrder - b.unlockOrder).slice(0, 1);
  return pool[Math.abs(step) % pool.length];
}

export function getDelayMs(step: number): number {
  return Math.max(4200, 7000 - step * 250);
}

export const pickNextLetter = (layout: LayoutId) => {
  const keys = keyboardLayouts[layout].keys;
  return keys[Math.floor(Math.random() * keys.length)].letter;
};
