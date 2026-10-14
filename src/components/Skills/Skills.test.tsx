import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Skills } from "./Skills";
import { resumeContent } from "../../content/resume";

describe("Skills", () => {
  it("renders an H2 'Skills' heading", () => {
    render(<Skills />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Skills" }),
    ).toBeInTheDocument();
  });

  it("renders exactly 5 category cards, each with an H3 title", () => {
    render(<Skills />);
    const headings = screen.getAllByRole("heading", { level: 3 });
    expect(headings).toHaveLength(5);
    expect(headings.map((h) => h.textContent)).toEqual([
      "Backend",
      "Architecture",
      "Testing",
      "Data",
      "Tools",
    ]);
  });

  it("renders each category's chips exactly, sourced from src/content (ADR 0004)", () => {
    render(<Skills />);
    resumeContent.skills.forEach((group) => {
      const heading = screen.getByRole("heading", {
        level: 3,
        name: group.category,
      });
      // The chip <ul> is the heading's next sibling within the card.
      const card = heading.parentElement as HTMLElement;
      const list = within(card).getByRole("list");
      const items = within(list)
        .getAllByRole("listitem")
        .map((li) => li.textContent);
      expect(items).toEqual(group.items);
    });
  });

  it("marks up each category's chips as a real <ul><li> list", () => {
    render(<Skills />);
    const lists = screen.getAllByRole("list");
    // 5 chip lists (no other <ul> in this component).
    expect(lists).toHaveLength(5);
    lists.forEach((list) => {
      expect(within(list).getAllByRole("listitem").length).toBeGreaterThan(0);
    });
  });

  it("renders chips as non-interactive (no link/button role, no click handler)", () => {
    render(<Skills />);
    expect(screen.queryAllByRole("link")).toHaveLength(0);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });
});
