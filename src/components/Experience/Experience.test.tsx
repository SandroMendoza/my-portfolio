import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Experience } from "./Experience";
import { resumeContent } from "../../content/resume";

describe("Experience", () => {
  it("renders an H2 'Experience' heading followed by the role's H3 title (no skipped level)", () => {
    render(<Experience />);
    const h2 = screen.getByRole("heading", { level: 2, name: "Experience" });
    const h3 = screen.getByRole("heading", {
      level: 3,
      name: "Junior Software Web Developer I",
    });
    expect(h2).toBeInTheDocument();
    expect(h3).toBeInTheDocument();
    expect(screen.queryAllByRole("heading")).toHaveLength(2);
  });

  it("renders the exact meta line (company · dates)", () => {
    render(<Experience />);
    expect(
      screen.getByText("FFUF Manila · Oct 2022–Present"),
    ).toBeInTheDocument();
  });

  it("renders all 8 bullets exactly, as a real <ul><li>, sourced from src/content (ADR 0004)", () => {
    render(<Experience />);
    const list = screen.getByRole("list");
    const items = within(list)
      .getAllByRole("listitem")
      .map((li) => li.textContent);
    expect(items).toHaveLength(8);
    expect(items).toEqual(resumeContent.experience[0].highlights);
  });

  it("renders bullets with disc markers (list-disc)", () => {
    render(<Experience />);
    expect(screen.getByRole("list")).toHaveClass("list-disc");
  });
});
