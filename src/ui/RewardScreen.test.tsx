import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RewardScreen } from "./RewardScreen";

describe("RewardScreen", () => {
  it("shows Russian reward text and continues", async () => {
    const onContinue = vi.fn();

    render(<RewardScreen xp={48} decorItemId="sunny-rug" eggProgress={2} onContinue={onContinue} />);

    expect(screen.getByRole("heading", { name: "Награда!" })).toBeInTheDocument();
    expect(screen.getByText("Опыт: +48")).toBeInTheDocument();
    expect(screen.getByText("Новый декор: sunny-rug")).toBeInTheDocument();
    expect(screen.getByText("Яйцо: +2")).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Играть дальше" }));
    expect(onContinue).toHaveBeenCalled();
  });
});
