import { keyboardLayouts } from "./keyboardLayouts";
import type { LayoutId, LayoutProgress, LetterProgress, Profile } from "./types";

function createLetterProgress(): LetterProgress {
  return { attempts: 0, correct: 0, totalResponseMs: 0, mastered: false };
}

function createLayoutProgress(layoutId: LayoutId): LayoutProgress {
  const keys = [...keyboardLayouts[layoutId].keys].sort((a, b) => a.unlockOrder - b.unlockOrder);
  const letters = Object.fromEntries(keys.map((key) => [key.letter, createLetterProgress()]));

  return {
    unlockedLetters: keys.slice(0, 3).map((key) => key.letter),
    letters
  };
}

export function createDefaultProfile(selectedLayout: LayoutId = "ru"): Profile {
  return {
    selectedLayout,
    level: 1,
    xp: 0,
    eggProgress: 0,
    layoutProgress: {
      ru: createLayoutProgress("ru"),
      en: createLayoutProgress("en")
    },
    inventory: [],
    placedItems: []
  };
}
