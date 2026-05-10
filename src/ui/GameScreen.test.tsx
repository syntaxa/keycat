import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { createDefaultProfile } from "../domain/profile";
import { createSession } from "../domain/session";
import { keyboardLayouts } from "../domain/keyboardLayouts";
import { GameScreen } from "./GameScreen";

describe("GameScreen", () => {
  it("shows the active letter and reacts to wrong physical keyboard code", async () => {
    const profile = createDefaultProfile("ru");
    const layout = keyboardLayouts.ru;
    const session = createSession(profile, layout, 0);
    const onSessionChange = vi.fn();

    render(<GameScreen session={session} onSessionChange={onSessionChange} onFinish={vi.fn()} />);

    expect(screen.getByLabelText(`Буква ${session.currentKey.display}`)).toBeInTheDocument();

    await userEvent.keyboard("{KeyZ}");

    expect(onSessionChange).toHaveBeenCalledWith(expect.objectContaining({ lastEvent: "mistake" }));
  });
});
