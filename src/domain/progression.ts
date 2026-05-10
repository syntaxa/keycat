import { addItem } from "./inventory";
import { keyboardLayouts } from "./keyboardLayouts";
import type { ItemCategory, Profile } from "./types";

export const LEVEL_XP = 100;
export const xpForSuccess = 10;

export interface SessionReward {
  xp: number;
  eggProgress: number;
  decorItemId: string;
}

export interface DecorReward {
  itemId: string;
  category: ItemCategory;
}

export const decorRewards: DecorReward[] = [
  { itemId: "sunny-rug", category: "textiles" },
  { itemId: "yarn-ball", category: "toys" },
  { itemId: "cat-pillow", category: "beds" },
  { itemId: "window-plant", category: "plants" },
  { itemId: "fish-poster", category: "decorations" },
  { itemId: "tiny-sofa", category: "furniture" }
];

export function pickDecorReward(random = Math.random): string {
  const raw = random();
  const index = Math.min(decorRewards.length - 1, Math.max(0, Math.floor(raw * decorRewards.length)));
  return decorRewards[index].itemId;
}

export function applySessionReward(profile: Profile, reward: SessionReward): Profile {
  const totalXp = profile.xp + reward.xp;
  const levelUps = Math.floor(totalXp / LEVEL_XP);
  const level = profile.level + levelUps;
  const selectedLayoutProgress = profile.layoutProgress[profile.selectedLayout];
  const unlockedLetters = [...keyboardLayouts[profile.selectedLayout].keys]
    .sort((a, b) => a.unlockOrder - b.unlockOrder)
    .slice(0, Math.min(keyboardLayouts[profile.selectedLayout].keys.length, level + 2))
    .map((key) => key.letter);
  const withProgress = {
    ...profile,
    level,
    xp: totalXp % LEVEL_XP,
    eggProgress: profile.eggProgress + reward.eggProgress,
    layoutProgress: {
      ...profile.layoutProgress,
      [profile.selectedLayout]: {
        ...selectedLayoutProgress,
        unlockedLetters
      }
    }
  };

  return addItem(withProgress, reward.decorItemId);
}

export function applySessionXp(xp: number, correct: number) {
  const gained = correct * xpForSuccess;
  const nextXp = xp + gained;
  return { xp: nextXp, level: Math.floor(nextXp / LEVEL_XP) + 1, gained };
}
