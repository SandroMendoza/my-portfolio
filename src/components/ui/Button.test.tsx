import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders as a link when as=\"a\", with the given href", () => {
    render(
      <Button as="a" variant="primary" href="/resume/Sandro-Mendoza-Resume.pdf">
        Download Resume
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Download Resume" });
    expect(link).toHaveAttribute("href", "/resume/Sandro-Mendoza-Resume.pdf");
  });

  it("renders as a real <button type=\"button\"> by default", () => {
    render(<Button variant="secondary">Copy email</Button>);
    const button = screen.getByRole("button", { name: "Copy email" });
    expect(button).toHaveAttribute("type", "button");
  });

  it("renders as a presentational span (no interactive role) when as=\"span\"", () => {
    render(
      <Button as="span" variant="secondary" aria-hidden="true">
        View on GitHub
      </Button>,
    );
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByText("View on GitHub")).toBeInTheDocument();
  });

  it("applies the primary variant's accent background class", () => {
    render(
      <Button as="a" variant="primary" href="#">
        Primary
      </Button>,
    );
    expect(screen.getByRole("link")).toHaveClass("bg-accent");
  });

  it("applies the secondary variant's ghost/outline classes", () => {
    render(
      <Button as="a" variant="secondary" href="#">
        Secondary
      </Button>,
    );
    const link = screen.getByRole("link");
    expect(link).toHaveClass("border-accent");
    expect(link).toHaveClass("text-accent");
  });
});
