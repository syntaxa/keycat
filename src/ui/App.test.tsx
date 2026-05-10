import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { App } from "../App";

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the Russian title and switches layouts", async () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "Сиамский кисыч" })).toBeInTheDocument();
    expect(document.title).toBe("Сиамский кисыч");

    await userEvent.click(screen.getByRole("button", { name: "Английская раскладка" }));

    expect(screen.getByText("Раскладка: Английская")).toBeInTheDocument();
  });
});
