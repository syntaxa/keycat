import { describe, expect, it } from "vitest";
import { keyboardLayouts } from "./keyboardLayouts";

describe("keyboardLayouts", () => {
  it("defines Russian and English layouts with readable labels", () => {
    expect(keyboardLayouts.ru.label).toBe("Русская");
    expect(keyboardLayouts.en.label).toBe("English");
  });

  it("assigns every letter a row, quarter, display label, and physical code", () => {
    for (const layout of Object.values(keyboardLayouts)) {
      for (const key of layout.keys) {
        expect(key.letter.length).toBeGreaterThan(0);
        expect(key.display.length).toBeGreaterThan(0);
        expect(key.code).toMatch(/^(Key|Digit|Backquote|Bracket|Semicolon|Quote|Comma|Period)/);
        expect(["top", "home", "bottom"]).toContain(key.row);
        expect(["left", "centerLeft", "centerRight", "right"]).toContain(key.quarter);
      }
    }
  });

  it("contains full-ish RU and EN letter data without duplicates", () => {
    expect(keyboardLayouts.ru.keys.map((key) => key.letter)).toEqual(
      expect.arrayContaining(["а", "о", "е", "й", "ц", "у", "к", "н", "г", "ш", "щ", "з", "х", "ъ", "ё", "ж", "э", "ю"])
    );
    expect(keyboardLayouts.en.keys.map((key) => key.letter)).toEqual(
      expect.arrayContaining(["a", "s", "d", "f", "j", "k", "l", "q", "w", "e", "m"])
    );

    for (const layout of Object.values(keyboardLayouts)) {
      const letters = layout.keys.map((key) => key.letter);
      const codes = layout.keys.map((key) => key.code);
      expect(new Set(letters).size).toBe(letters.length);
      expect(new Set(codes).size).toBe(codes.length);
    }
  });
});
