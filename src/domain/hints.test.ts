import { describe, expect, it } from "vitest";
import { getHintForStage, nextHintAfterDelay } from "./hints";
import { keyboardLayouts } from "./keyboardLayouts";
describe("hints",()=>{it("moves stages",()=>{expect(nextHintAfterDelay("none")).toBe("quarter");});it("renders key hint",()=>{expect(getHintForStage("key",keyboardLayouts.ru.keys[0])).toContain("Клавиша");});});
