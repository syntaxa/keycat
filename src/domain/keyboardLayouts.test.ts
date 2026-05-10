import { describe, expect, it } from "vitest";
import { keyboardLayouts } from "./keyboardLayouts";
describe("keyboardLayouts",()=>{it("defines Russian and English layouts",()=>{expect(keyboardLayouts.ru.label).toBe("Русская");expect(keyboardLayouts.en.label).toBe("English");});});
