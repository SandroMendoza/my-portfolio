import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { CloseIcon, DownloadIcon, MenuIcon } from "./icons";

describe("icons", () => {
  it.each([
    ["MenuIcon", MenuIcon],
    ["CloseIcon", CloseIcon],
    ["DownloadIcon", DownloadIcon],
  ])("%s renders as a decorative (aria-hidden) svg", (_name, Icon) => {
    const { container } = render(<Icon />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });
});
