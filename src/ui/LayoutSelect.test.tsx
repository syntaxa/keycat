import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe,it,expect,vi } from "vitest";
import { LayoutSelect } from "./LayoutSelect";
describe("LayoutSelect",()=>{it("switches layout",async()=>{const onChange=vi.fn();render(<LayoutSelect value="ru" onChange={onChange}/>);await userEvent.click(screen.getByText("English"));expect(onChange).toHaveBeenCalledWith("en");});});
