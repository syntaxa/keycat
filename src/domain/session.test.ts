import { describe, expect, it } from "vitest";
import { keyboardLayouts } from "./keyboardLayouts";
import { createDefaultProfile } from "./profile";
import { createSession, handleDelay, handleKeyPress, isSessionComplete } from "./session";

describe("session", () => {
  it("creates a session with a physical-code target", () => {
    const profile = createDefaultProfile("ru");
    const session = createSession(profile, keyboardLayouts.ru, 1000);

    expect(session.currentKey.code).toMatch(/^(Key|Backquote|Bracket|Semicolon|Quote|Comma|Period)/);
    expect(session.startedAt).toBe(1000);
    expect(session.correctCount).toBe(0);
    expect(session.hintStage).toBe("none");
  });

  it("handles correct physical key presses until the session completes", () => {
    let session = createSession(createDefaultProfile("en"), keyboardLayouts.en, 0);

    for (let index = 0; index < 10; index += 1) {
      session = handleKeyPress(session, session.currentKey.code, 400);
    }

    expect(session.correctCount).toBe(10);
    expect(session.lastEvent).toBe("success");
    expect(session.catMood).toBe("happy");
    expect(isSessionComplete(session)).toBe(true);
  });

  it("escalates hints after mistakes and delays", () => {
    let session = createSession(createDefaultProfile("ru"), keyboardLayouts.ru, 0);

    session = handleKeyPress(session, "KeyZ", 900);
    expect(session.mistakeCount).toBe(1);
    expect(session.lastEvent).toBe("mistake");
    expect(session.catMood).toBe("mistake");
    expect(session.hintStage).toBe("row");

    session = handleDelay(session);
    expect(session.hintStage).toBe("key");
  });
});
