import { describe, expect, it } from "vitest";
import { getHintForStage, nextHintAfterDelay, nextHintAfterMistake, softenHintAfterSuccess } from "./hints";
import { keyboardLayouts } from "./keyboardLayouts";

const letterA = keyboardLayouts.ru.keys.find((key) => key.letter === "а")!;

describe("hints", () => {
  it("returns structured hint data for each stage", () => {
    expect(getHintForStage(letterA, "none")).toEqual({ stage: "none" });
    expect(getHintForStage(letterA, "quarter")).toEqual({ stage: "quarter", quarter: "centerLeft" });
    expect(getHintForStage(letterA, "row")).toEqual({ stage: "row", row: "home" });
    expect(getHintForStage(letterA, "key")).toEqual({ stage: "key", code: "KeyF" });
  });

  it("increases and softens hint strength", () => {
    expect(nextHintAfterDelay("none")).toBe("quarter");
    expect(nextHintAfterDelay("quarter")).toBe("row");
    expect(nextHintAfterMistake("row")).toBe("key");
    expect(nextHintAfterMistake("key")).toBe("key");
    expect(softenHintAfterSuccess("key")).toBe("row");
    expect(softenHintAfterSuccess("quarter")).toBe("none");
  });

  it("keeps the old render-style call available for existing UI", () => {
    expect(getHintForStage("key", letterA)).toContain("Клавиша");
  });
});
