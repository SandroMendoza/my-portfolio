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
});
