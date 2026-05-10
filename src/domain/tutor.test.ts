import { describe, expect, it } from "vitest";
import { keyboardLayouts } from "./keyboardLayouts";
import { createDefaultProfile } from "./profile";
import { applySessionReward } from "./progression";
import { chooseNextKey, getDelayMs } from "./tutor";

describe("tutor", () => {
  it("keeps hint escalation calm for children", () => {
    expect(getDelayMs(0)).toBeGreaterThanOrEqual(6500);
    expect(getDelayMs(10)).toBeGreaterThanOrEqual(4200);
  });

  it("changes priority after letters have been practiced", () => {
    const profile = createDefaultProfile("en");
    const initialSequence = [0, 1, 2].map((step) => chooseNextKey(profile, keyboardLayouts.en, step).letter);
    const practiced = applySessionReward(profile, {
      xp: 20,
      eggProgress: 1,
      decorItemId: "sunny-rug",
      responses: [
        { letter: initialSequence[0], code: "KeyA", correct: true, responseMs: 700 },
        { letter: initialSequence[0], code: "KeyA", correct: true, responseMs: 800 }
      ]
    });
    const nextSequence = [0, 1, 2].map((step) => chooseNextKey(practiced, keyboardLayouts.en, step).letter);

    expect(nextSequence).not.toEqual(initialSequence);
    expect(nextSequence.at(-1)).toBe(initialSequence[0]);
  });
});
