import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { About } from "./About";
import { resumeContent } from "../../content/resume";

describe("About", () => {
  it("renders an H2 heading 'About'", () => {
    render(<About />);
    expect(
      screen.getByRole("heading", { level: 2, name: "About" }),
    ).toBeInTheDocument();
  });

  it("renders the exact approved body copy from src/content, not hardcoded in JSX", () => {
    render(<About />);
    expect(screen.getByText(resumeContent.about.body)).toBeInTheDocument();
  });

  it("renders the body text with the primary (not secondary) text color token", () => {
    render(<About />);
    const paragraph = screen.getByText(resumeContent.about.body);
    expect(paragraph).toHaveClass("text-text-primary");
  });
});
