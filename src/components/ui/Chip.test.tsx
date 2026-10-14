import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Chip } from "./Chip";

describe("Chip", () => {
  it("renders as a real list item so a wrapping <ul> announces as a list", () => {
    render(
      <ul>
        <Chip>Kotlin</Chip>
        <Chip>Spring Boot</Chip>
      </ul>,
    );
    const list = screen.getByRole("list");
    expect(list).toBeInTheDocument();
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Kotlin");
  });

  it("uses the pill radius and accent-tint background tokens", () => {
    render(
      <ul>
        <Chip>Docker</Chip>
      </ul>,
    );
    const item = screen.getByRole("listitem");
    expect(item).toHaveClass("rounded-pill");
    expect(item).toHaveClass("bg-accent-tint");
    expect(item).toHaveClass("text-accent-chip-text");
  });
});
