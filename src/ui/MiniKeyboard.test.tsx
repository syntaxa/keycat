import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { keyboardLayouts } from "../domain/keyboardLayouts";
import { MiniKeyboard } from "./MiniKeyboard";

describe("MiniKeyboard", () => {
  it("highlights only the current quarter inside the hinted row", () => {
    render(<MiniKeyboard layout={keyboardLayouts.en} currentLetter="a" hintStage="row" />);

    expect(screen.getByText("A")).toHaveClass("highlighted");
    expect(screen.getByText("S")).toHaveClass("highlighted");
    expect(screen.getByText("D")).not.toHaveClass("highlighted");
    expect(screen.getByText("Q")).not.toHaveClass("highlighted");
  });
});
