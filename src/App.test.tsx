import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  it("renders the sticky Nav landmark", () => {
    render(<App />);
    expect(
      screen.getByRole("navigation", { name: "Section" }),
    ).toBeInTheDocument();
  });

  // MP-3 AC: "this Hero H1 is the only H1 on the entire page." Checked at
  // the App level (not just within Hero in isolation) since that's the only
  // place "the entire page" is actually assembled.
  it("renders exactly one H1 on the whole page (Hero's name)", () => {
    render(<App />);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent("Sandro Mendoza");
  });

  it("renders the About section", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { level: 2, name: "About" }),
    ).toBeInTheDocument();
  });

  it("renders the Skills section", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Skills" }),
    ).toBeInTheDocument();
  });

  it("renders the Experience section", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Experience" }),
    ).toBeInTheDocument();
  });
});
