import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SectionHeading } from "./SectionHeading";

describe("SectionHeading", () => {
  it("renders its text as a level-2 heading", () => {
    render(<SectionHeading>Skills</SectionHeading>);
    const heading = screen.getByRole("heading", { level: 2, name: "Skills" });
    expect(heading).toBeInTheDocument();
  });

  it("renders the accent rule by default, hidden from assistive tech", () => {
    const { container } = render(<SectionHeading>Projects</SectionHeading>);
    const rule = container.querySelector('[aria-hidden="true"]');
    expect(rule).toBeInTheDocument();
    expect(rule).toHaveClass("bg-accent");
  });

  it("omits the rule when withRule is false", () => {
    const { container } = render(
      <SectionHeading withRule={false}>About</SectionHeading>,
    );
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument();
  });
});
