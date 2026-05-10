import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { LayoutSelect } from "./LayoutSelect";

describe("LayoutSelect", () => {
  it("switches layout with planned props and shows the active layout clearly", async () => {
    const onSelect = vi.fn();

    render(<LayoutSelect selectedLayout="ru" onSelect={onSelect} />);

    expect(screen.getByText("Активна: Русская")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Русская раскладка активна" })).toHaveAttribute("aria-pressed", "true");

    await userEvent.click(screen.getByRole("button", { name: "Английская раскладка" }));

    expect(onSelect).toHaveBeenCalledWith("en");
  });
});
