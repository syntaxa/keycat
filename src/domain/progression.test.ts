import { describe, expect, it } from "vitest";
import { keyboardLayouts } from "./keyboardLayouts";
import { createDefaultProfile } from "./profile";
import { applySessionReward, decorRewards, LEVEL_XP, pickDecorReward } from "./progression";

describe("progression", () => {
  it("applies xp, levels, egg progress, and decor reward", () => {
    const profile = createDefaultProfile();
    const updated = applySessionReward(profile, { xp: LEVEL_XP + 20, eggProgress: 2, decorItemId: "sunny-rug" });

    expect(updated.level).toBe(2);
    expect(updated.xp).toBe(20);
    expect(updated.eggProgress).toBe(2);
    expect(updated.inventory).toEqual([{ itemId: "sunny-rug", count: 1, isNew: true, favorite: false }]);
    expect(profile.inventory).toEqual([]);
  });

  it("picks decor rewards from the reward table using randomness", () => {
    expect(decorRewards.length).toBeGreaterThan(2);
    expect(pickDecorReward(() => 0)).toBe(decorRewards[0].itemId);
    expect(pickDecorReward(() => 0.999)).toBe(decorRewards[decorRewards.length - 1].itemId);
  });

  it("unlocks more letters for the selected layout after level ups", () => {
    const profile = createDefaultProfile("ru");
    const initialLetters = profile.layoutProgress.ru.unlockedLetters;
    const updated = applySessionReward(profile, { xp: LEVEL_XP, eggProgress: 1, decorItemId: "sunny-rug" });
    const expectedLetters = [...keyboardLayouts.ru.keys]
      .sort((a, b) => a.unlockOrder - b.unlockOrder)
      .slice(0, updated.level + 2)
      .map((key) => key.letter);

    expect(updated.layoutProgress.ru.unlockedLetters).toEqual(expectedLetters);
    expect(updated.layoutProgress.ru.unlockedLetters.length).toBeGreaterThan(initialLetters.length);
    expect(updated.layoutProgress.en.unlockedLetters).toEqual(profile.layoutProgress.en.unlockedLetters);
  });

  it("records letter practice so the next session changes priority", () => {
    const profile = createDefaultProfile("en");
    const practiced = applySessionReward(profile, {
      xp: 20,
      eggProgress: 1,
      decorItemId: "sunny-rug",
      responses: [
        { letter: "a", code: "KeyA", correct: true, responseMs: 800 },
        { letter: "a", code: "KeyA", correct: true, responseMs: 700 },
        { letter: "d", code: "KeyD", correct: false, responseMs: 1600 }
      ]
    });

    expect(practiced.layoutProgress.en.letters.a).toMatchObject({
      attempts: 2,
      correct: 2,
      totalResponseMs: 1500
    });
    expect(practiced.layoutProgress.en.letters.d).toMatchObject({
      attempts: 1,
      correct: 0,
      totalResponseMs: 1600
    });
  });
});
